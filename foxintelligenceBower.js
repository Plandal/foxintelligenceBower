(function ($) {

    var cleanHtml = function (string) {
        let str = string.replace(/\\r\\n/g, '');
        str = str.replace(/\\"/g, '"');
        str = str.replace(/ " /g, '');
        let start = str.indexOf("<body");
        let end = str.indexOf("</body>");
        str = str.substring(start, (end + 7));
        return str;
    }

    var findTrips = function (jqObj) {
        var obj = {}
        let tmpAge;
        var trips = {};
        var travels = $(jqObj).find('table.product-details');
        var roundTrips = [];

        //roundTrips
        for (var i = 0; i < travels.length; i++) {
            let info = {};
            let train = {};
            let passengers = [];

            //train
            info.type = $($(travels[i]).find('td')[0]).html();
            info.date = $(travels[i]).prev().find('td').html();
            info.trains = [train];

            train.departureTime = $($(travels[i]).find('td')[1]).html();
            train.departureStation = $($(travels[i]).find('td')[2]).html();
            train.arrivalTime = $($(travels[i]).find('td')[7]).html();
            train.arrivalStation = $($(travels[i]).find('td')[8]).html();
            train.type = $($(travels[i]).find('td')[3]).html();
            train.number = $($(travels[i]).find('td')[4]).html();

            let nbPass = $(travels[i]).next().find('tr');
            //passengers
            for (var y = 0; y < nbPass.length; y++) {
                if (y % 2 === 1) {
                    let objPass = {};
                    tmpAge = $(nbPass[y]).find('td.typology').last().html();
                    objPass.type = $(nbPass[y]).find('td.typology').next().children().first().html();
                    objPass.age = tmpAge.substring(tmpAge.indexOf('('), (tmpAge.indexOf(')') + 1));
                    passengers.push(objPass);
                }
            }

            train.passengers = passengers;
            roundTrips.push(info);
        }

        //détails
        let details = {};
        details.price = $(jqObj).find('td.very-important').html().replace(' €', '');
        details.roundTrips = roundTrips

        //trips
        trips.code = $($(jqObj).find('span.pnr-info')[$(jqObj).find('span.pnr-info').length - 2]).html();
        trips.name = $($(jqObj).find('span.pnr-info')[$(jqObj).find('span.pnr-info').length - 1]).html();
        trips.details = details;

        var result = {};
        result.trips = trips;

        //custom
        var cell = $(jqObj).find('td.cell');
        var prices = [];
        for (var z = 0; z < cell.length; z++) {
            if (z % 2 === 1) {
                prices.push($(cell[z]).html().replace('€', ''));
            }
        }
        let temp = $(jqObj).find('td.amount').html();
        prices.push(temp.substring(0, temp.indexOf('€')));
        result.custom = {"prices": prices};

        //root
        obj.status = "ok";
        obj.result = result

        return JSON.stringify(obj);
    }

    var htmlToJson = function (str) {
        var jqObj = $(str);
        var obj = findTrips(jqObj);
        return obj;
    }
    $.fn.fiHtmlToJson = function (file) {
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                var str = evt.target.result;
                str = cleanHtml(str);
                var json = htmlToJson(str);

                var toDownload = new Blob([json], {type: 'application/json'});
                var link = window.URL.createObjectURL(toDownload);
                window.location = link;
            }
            reader.onerror = function (evt) {
                console.log('error');
            }
        }
    };
})(jQuery);