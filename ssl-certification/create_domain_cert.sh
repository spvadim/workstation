# скрипт упадёт от любой ошибки в процессе
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit ; pwd -P )"

# import DNS_DOMAINS, IP_DOMAINS, DOMAIN_CERT_DAYS
. "${SCRIPTPATH}/../.env"

CA_PATH="${SCRIPTPATH}"
DOMAIN_PATH="${SCRIPTPATH}/../frontend/nginx/ssl"

CA_KEYPAIR="rootCA"
DOMAIN_KEYPAIR="nginx-selfsigned"

ca_crt="${CA_PATH}/${CA_KEYPAIR}.crt"
ca_key="${CA_PATH}/${CA_KEYPAIR}.key"
v3_ext_template="${CA_PATH}/v3.ext"
v3_ext="/tmp/__v3.ext"
domain_crt="${DOMAIN_PATH}/${DOMAIN_KEYPAIR}.crt"
domain_key="${DOMAIN_PATH}/${DOMAIN_KEYPAIR}.key"
domain_csr="/tmp/${DOMAIN_KEYPAIR}.csr"
domain_dhparam="${DOMAIN_PATH}/dhparam.pem"

subject="/C=RU/ST=None/L=Ekaterinburg/O=Akson/CN=Akson Testing Cert"

if [ ! -f "${ca_crt}" ]; then
  echo 'Please run "create_root_cert_and_key.sh" first, and try again!'
  exit
fi
if [ ! -f "${v3_ext_template}" ]; then
  echo 'Please download the "v3.ext" file and try again!'
  exit
fi

# создаём новые ключ и запрос на подпись сертификата
openssl req -new -newkey rsa:2048 -sha256 -nodes \
  -keyout "${domain_key}" \
  -subj "${subject}" \
  -out "${domain_csr}"

# проверяем корректность получившегося запроса
openssl req -in "${domain_csr}" -noout -text

# парсим список доменов
IFS=';' read -ra ip_domains <<<"$IP_DOMAINS"
IFS=';' read -ra dns_domains <<<"$DNS_DOMAINS"

# обрабатываем список доменов для вставки в шаблон
domains=""

i=1
for domain in "${ip_domains[@]}"; do
  domains="${domains}IP.$((i++)) = $domain\n"
done
i=1
for domain in "${dns_domains[@]}"; do
  domains="${domains}DNS.$((i++)) = $domain\n"
done

domains="${domains::-2}"

# встраиваем домены в v3.ext шаблон
sed "s/%%DOMAINS%%/${domains}/g" <"${v3_ext_template}" >"${v3_ext}"

# подписываем запрос нашим (root) CA-keypair, получаем подписанный сертификат
openssl x509 -req \
  -in "${domain_csr}" \
  -CA "${ca_crt}" \
  -CAkey "${ca_key}" \
  -CAcreateserial \
  -out "${domain_crt}" \
  -days "${DOMAIN_CERT_DAYS}" \
  -sha256 \
  -extfile "${v3_ext}"

# проверяем корректность получившегося сертификата
openssl x509 -in "${domain_crt}" -noout -text

# генерируем DH-параметр. Это надолго!
# не обязательно выполнять каждый раз - (главное чтобы был хоть какой-то dhparam-файл)
#openssl dhparam -out "${domain_dhparam}" 4096
