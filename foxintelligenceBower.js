(function ($) {

    var cleanHtml = function (string) {
        let str = string.replace(/\\r\\n/g, '');
        str = str.replace(/\\"/g, '"');
        return str;
    }
    var htmlToJson = function (str) {
        let jqObj = $(str);
        var obj = {};
        console.log('test = ', jqObj.find('table.passengers'));
        return obj;
    }
    $.fn.fiHtmlToJson = function (file) {

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                var str = evt.target.result;
                str = cleanHtml(str);
                console.log('str 2 = ', str);
                var obj = htmlToJson(str);
                return obj;
            }
            reader.onerror = function (evt) {
                console.log('error');
            }
        }
    };
})(jQuery);