// Zet een js-klasse op <html> zodat de CSS alleen dán inhoud verbergt om die
// later in te faden. Zonder JavaScript blijft alles gewoon zichtbaar.
// Apart bestand omdat de Content-Security-Policy inline scripts blokkeert.
document.documentElement.classList.add('js');
