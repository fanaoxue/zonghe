export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
    } else {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://webapi.amap.com/maps?v=1.4.4&key=dcd4651c8b2e81e0818414f7b3b959cf&plugin=AMap.Geocoder&callback=initAMap';
      script.onerror = reject;
      // script.onload = resolve;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}
