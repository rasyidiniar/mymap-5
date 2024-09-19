import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
// import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}

  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap!: string;

  // private latitude: number | any;
  // private longitude: number | any;

  async ngOnInit() {
    // this.longitude = 107.60222418732602;
    // this.latitude = -6.924279673146295;

    // const position = await Geolocation.getCurrentPosition();
    // this.latitude = position.coords.latitude;
    // this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: "gray-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 12,
      // center: [this.longitude, this.latitude]
    });


    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    this.addWeatherServiceMarker();

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async changeBasemap() {
    this.mapView.map.basemap = this.selectedBasemap;
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addWeatherServiceMarker() {
    const weatherServiceLoc = new Point({
      latitude: 35.2271,
      longitude:  -80.8431,
    });

    const WeatherServiceMarker = new Graphic({
      geometry: weatherServiceLoc,
      symbol: new SimpleMarkerSymbol(),
    })

    this.mapView.graphics.add(WeatherServiceMarker);
  }

}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
