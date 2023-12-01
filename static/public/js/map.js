class Alert_map {
    lat = 48.3358856;
    lng = 31.1788196;
    lat_lng = [this.lat, this.lng]
    z = 6.4;

    geo_url = ''

    map;
    osm;
    ukraine_geojson;

    isAdmin = false;
    cities = {};
    emergencies = {};
    emergency_types = {}

    markers = [];
    circles = [];

    real_world_layer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
        'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    white_layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
    });

    openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

    baseLayers = {
        "Real Map": this.real_world_layer,
        "White Map": this.white_layer,
        "Open Street Map": this.openstreetmap
    };

    constructor(
        cities,
        emergencies,
        emergency_types,
        geo_url = '',
        isAdmin = false
    ) {
        this.cities = cities;
        this.emergencies = emergencies;
        this.emergency_types = emergency_types;
        this.geo_url = geo_url;
        this.isAdmin = isAdmin;
    }

    init() {
        let that = this;
        this.map = L.map('freeMap').setView(
            this.lat_lng,
            this.z
        );
        this.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        this.osm.addTo(this.map);

        if (this.geo_url) {
            this.ukraine_geojson = new L.geoJson();
            this.ukraine_geojson.addTo(this.map);

            let that = this;
            $.ajax({
                dataType: "json",
                url: this.geo_url,
                success: function (data) {
                    $(data.features).each(function (key, data) {
                        that.ukraine_geojson.addData(data);
                        that.ukraine_geojson.bringToBack();
                    });
                },
                error: function () {
                }
            });
        }

        let layerControl = L.control.layers(this.baseLayers);
        layerControl.addTo(this.map);

        this.wind_controller = WindJSLeaflet.init({
            localMode: false,
            map: this.map,
            layerControl: layerControl,
            useNearest: false,
            timeISO: null,
            nearestDaysLimit: 7,
            displayValues: true,
            displayOptions: {
                displayPosition: 'bottomleft',
                displayEmptyString: 'No wind data'
            },
            overlayName: 'wind',

            // https://github.com/danwild/wind-js-server
            pingUrl: 'http://localhost:7000/alive',
            latestUrl: 'http://localhost:7000/latest',
            nearestUrl: 'http://localhost:7000/nearest',
            errorCallback: this.handleError
        });
    }

    add_markers() {
        Object.values(this.cities).forEach(city => {
            let marker = L.marker([city.lat, city.lng]).addTo(this.map);
            this.markers.push(marker);
        });
    }

    add_emergencies() {
        let that = this
        Object.values(this.emergencies).forEach(function (emergency, emergency_id) {
            let city = that.cities[emergency.city_id]

            let circle = L.circle([city.lat, city.lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: emergency.radius,
                emergency_id: emergency_id
            });

            circle.addTo(that.map);

            circle.bindPopup(`
                <b>${emergency.title}</b><br>
                <p>${emergency.description}</p>
            `);

            circle.on('click', function (e) {
                let key = Object.keys(that.emergencies)[e.target.options.emergency_id]; //fetched the key at second index
                that.display_city_events(that.emergencies[key], key)
            })

            that.circles.push(circle);
        })
    }

    display_city_events(emergency, emergency_id) {
        let city = this.cities[emergency.city_id]

        let area_events = $('#area_events');
        area_events.html('');

        $('#area_events_header').html(`
        <h3 class="card-title">
            <i class="fas fa-bullhorn"></i>
            Надзвичайні події
        </h3>
        <br>
        <h3 class="card-title mt-3">
            <i class="fas fa-city"></i>
            ${city.name}
        </h3>
        `)

        $('#city_name').val(city.name)
        let alert_cards = '';
        alert_cards += `
            <div class="callout callout-danger">
                <h4>${emergency.title}</h4>
                <div class="row">
                    <div class="col-6">
                        <h5>Радіус впливу:</h5>
                        <p>${emergency.radius}</p>
                    </div>
                    <div class="col-6">
                        <h5>Тип події</h5>
                        <p>${this.emergency_types[emergency.emergency_type].name}</p>
                    </div>
                </div>
                <div class="mt-2 mb-2">
                    <h5>Опис:</h5>
                    <p>${emergency.description}</p>
                </div>
            `
        if (this.isAdmin) {
            alert_cards += `<a type="button" href="delete_event/${emergency_id}" class="btn btn-block btn-danger">Видалити</a>`
        }

        alert_cards += `</div>`
        // region.events.forEach(region_event => {
        //     alert_cards += `
        //     <div class="callout callout-danger">
        //         <h5>${region_event.title}</h5>
        //         <p>${region_event.description}</p>
        //         <a type="button" href="delete_event/${region_event.id}" class="btn btn-block btn-danger">Видалити</a>
        //     </div>
        //     `
        // });
        area_events.html(alert_cards)
    }

    handleError = function(err){
        console.log('handleError...');
        console.log(err);
    };

    vector_to_speed(uMs, vMs) {
		let wind_abs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
		return wind_abs;
	}
    
    vector_to_degrees(uMs, vMs) {
		let wind_abs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
		let wind_dir_trig_to = Math.atan2(uMs / wind_abs, vMs / wind_abs);
		let wind_dir_trig_to_degrees = wind_dir_trig_to * 180 / Math.PI;
		let wind_dir_trig_from_degrees = wind_dir_trig_to_degrees + 180;

		return wind_dir_trig_from_degrees.toFixed(3);
	}

    get_wind(lat, lng) {
		let gridValue = this.wind_controller._windy.interpolatePoint(lng, lat);
		let js_out = {
            success: true,
            lat: lat,
            lng: lng,
            wind_speed: 0,
            wind_degrees: 0,
            temperature: 0
        };

        if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {

			// vMs comes out upside-down..
			let vMs = gridValue[1];
			vMs = vMs > 0 ? vMs - vMs * 2 : Math.abs(vMs);

            js_out.wind_speed = this.vector_to_speed(gridValue[0], vMs).toFixed(1);
            js_out.wind_degrees = this.vector_to_degrees(gridValue[0], vMs);
            js_out.temperature = (gridValue[2] - 273.15).toFixed(1)
		} else {
			js_out.success = false;
		}
        
        return js_out;
    }
}


