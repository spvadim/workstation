import imgFooterLogo from 'src/assets/images/footer-logo.svg';
import "./footer.scss";

const Footer = (): JSX.Element => {
    return (
        <footer>
            <img src={imgFooterLogo}/>
            ПАК Верификации 2D кодов
        </footer>
    )
}

export default Footer;