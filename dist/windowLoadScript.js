var windowHasLoaded = false;

var navData = window.performance.getEntriesByType("navigation");
if (navData.length > 0 && navData[0].loadEventEnd > 0)
{
    windowHasLoaded = true;
} else {
    console.log('Document is not loaded');
}
