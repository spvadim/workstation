SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit ; pwd -P )"

. "${SCRIPTPATH}/../.env"
# ROOT_CERT_DAYS imported

CA_PATH="${SCRIPTPATH}"
CA_KEYPAIR="rootCA"
CA_CERT_DAYS_COUNT="$ROOT_CERT_DAYS"

ca_key="${CA_PATH}/${CA_KEYPAIR}.key"
ca_crt="${CA_PATH}/${CA_KEYPAIR}.crt"

# создаём приватный ключ для CA сертификата
openssl genrsa -out "${ca_key}" 4096

# создаём CA-сертификат, подписанный нашим приватным ключом (interactive)
openssl req -x509 -new -nodes \
  -key "${ca_key}" \
  -sha256 \
  -out "${ca_crt}" \
  -days "${CA_CERT_DAYS_COUNT}"
