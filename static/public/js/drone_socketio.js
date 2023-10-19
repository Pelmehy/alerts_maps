$(function () {
    let drone_connect = $('#drone_connect')

    let socket_url = 'http://' + document.domain + ':' + location.port
    console.log(socket_url)
    let socket = io.connect('http://' + document.domain + ':' + location.port)
    console.log(socket);

    socket.on('drone_connection', function () {
        console.log('drone connected!')

        let socket_connection = $('#socket_connection')
        let connection_status = $('#connection_status')


        connection_status.removeClass('bg-danger')
        connection_status.removeClass('bg-warning')
        connection_status.addClass('badge-success')
        connection_status.text('Connected')


        socket_connection.text('True')
        socket_connection.removeClass('bg-danger')
        socket_connection.addClass('badge-success')
    });

    socket.on('cur_drone_gps', function (data) {
        console.log(data)

        $('#latitude').text(data.cur_lat)
        $('#longitude').text(data.cur_lon)
        $('#altitude').text(data.cur_alt)

        let degrees = Math.round(data.yaw * (180/3.14))

        $('#gps_yaw').val(degrees)

        $('#latitude').trigger('gps_update', ['Custom', 'Event'])
    })

    socket.on('drone_settings', function (data) {
        console.log(data)
        let socket_arm = $('#socket_arm')
        let socket_took_off = $('#socket_took_off')
        let socket_ground_speed = $('#socket_ground_speed')
        let app_mode = $('#app_mode')

        if (data.arm) {
            socket_arm.text('True')
            socket_arm.removeClass('bg-warning')
            socket_arm.addClass('badge-success')
        } else {
            socket_arm.text('False')
            socket_arm.removeClass('badge-success')
            socket_arm.addClass('bg-warning')
        }

        if (data.is_took_off) {
            socket_took_off.text('True')
            socket_took_off.removeClass('bg-warning')
            socket_took_off.addClass('badge-success')
        } else {
            socket_took_off.text('False')
            socket_took_off.removeClass('badge-success')
            socket_took_off.addClass('bg-warning')
        }

        socket_ground_speed.text(data.ground_speed)
        app_mode.text(data.app_mode)
    })
})