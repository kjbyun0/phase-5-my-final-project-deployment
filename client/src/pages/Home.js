import Slider from "react-slick";
import { Container } from 'semantic-ui-react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    // adaptiveHeight: true,
    // variableWidth: true,
    // autoplay: true,
    // centerMode: true,
    // centerPadding: '100px',
    // useCSS: true,
};

const images = [
    '/61uNj76JeeL._SX3000_.jpg',
    '/71H233HOaTL._SX3000_.jpg', 
    '/71WQ5JRXJ7L._SX3000_.jpg',
    '/71CkwcSsmjL._SX3000_.jpg',  
];

// function Home() {
//     return (
//         <Container >
//             <Slider {...settings}>
//                 <div>
//                     <img style={{objectFit: 'contain', }} src={images[0]} />
//                 </div>
//                 <div>
//                     <img style={{objectFit: 'contain', }} src={images[1]} />
//                 </div>
//                 <div>
//                     <img style={{objectFit: 'contain', }} src={images[2]} />
//                 </div>
//                 <div>
//                     <img style={{objectFit: 'contain', }} src={images[3]} />
//                 </div>
//             </Slider>
//         </Container>
//     );
// }

function Home() {
    return (
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1>test</h1>
        </div>
    );
}

export default Home;
