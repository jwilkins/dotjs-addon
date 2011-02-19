var pageMod = require('page-mod'),
    data = require('self').data,
    file = require('file'),
    url = require('url');

pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('jquery-1.5.min.js'),
    contentScript:
        'onMessage = function onMessage(script) { eval(script); };' +
        'postMessage(document.URL); console.log(jQuery.fn.jquery);',
    onAttach: function onAttach(worker) {
        worker.on('message', function(data) {
            var domain = url.URL(data).host;
            if (domain.indexOf('www.') === 0) {
                domain = domain.substring(4, domain.length);
            }
            var filename = '~/.js/' + domain + '.js';
            if (file.exists(filename)) {
                worker.postMessage(file.read(filename));
            }
        });
    }
});