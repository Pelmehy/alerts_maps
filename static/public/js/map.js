class Alert_map {
    lat = 48.3358856;
    lng = 31.1788196;
    lat_lng = [this.lat, this.lng]
    z = 6.4;

    geo_url = ''

    map;
    osm;
    ukraine_geojson;

    cities = {};
    emergencies = {};
    emergency_types = {}

    markers = [];
    circles = [];

    constructor(
        cities,
        emergencies,
        emergency_types,
        geo_url = ''
    ) {
        this.cities = cities;
        this.emergencies = emergencies;
        this.emergency_types = emergency_types;
        this.geo_url = geo_url
    }

    init() {
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
                success: function(data) {
                    $(data.features).each(function(key, data) {
                        that.ukraine_geojson.addData(data);
                        that.ukraine_geojson.bringToBack();
                    });
                },
                error: function() {}
            });
        }

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

            console.log(emergency)
            console.log(city)


            let circle = L.circle([city.lat, city.lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: emergency.radius,
                emergency_id: emergency_id
            });

            circle.addTo(that.map);
            console.log(circle['options'])

            // let pos = this.map.latLngToLayerPoint(circle.getLatLng()).round();
            // circle.zIndexOffset(-1);

            circle.bindPopup(`
                <b>${emergency.title}</b><br>
                <p>${emergency.description}</p>
            `);

            circle.on('click', function (e) {
                let key = Object.keys(that.emergencies)[e.target.options.emergency_id]; //fetched the key at second index
                that.display_city_events(that.emergencies[key])
            })

            that.circles.push(circle);
        })
    }

    display_city_events(emergency) {
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

        $('#city_name').val(city.id)
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
                
                <a type="button" href="delete_event/${emergency.id}" class="btn btn-block btn-danger">Видалити</a>
            </div>
            `
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

}


