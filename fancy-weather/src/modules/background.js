
const apiKeyPic = 'pigQDjaBlkcZ2JFX4O3-fRy3oVcqSqaPXyrxI3hc8NY';
const secretKey = 'ZTbqLQKaSTWLvzPJGxFGKC2Sec661U_ZK7Y6Npoqcs8';
// const searchUrlPic = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature,clouds,Spb&client_id=${apiKeyPic}`;
const searchUrlPic = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature,spring&client_id=${apiKeyPic}`;

const getBackground = async () => {
  try {
    const responce = await fetch(searchUrlPic);
    const {
      urls: { regular },
    } = await responce.json();
    document.querySelector('.background').style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4) ), url('${regular}')`;
    console.log('answer from pic: ', regular);
  } catch(e) {
    console.log('getBackground: ', e);
  }
};

export default getBackground;
