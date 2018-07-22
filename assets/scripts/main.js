'use strict';

var run = require('./run');

window.addEventListener('DOMContentLoaded', run.setup_from_url);
window.addEventListener('DOMContentLoaded', run.setup_from_cookie);
window.addEventListener('DOMContentLoaded', run.run);
document.getElementById('day').onclick = run.switch_to_day;
document.getElementById('night').onclick = run.switch_to_night;
document.getElementById('cog').onclick = run.show_settings;
document.getElementById('info').onclick = run.show_info;
document.getElementById('dragarea_option1').onchange = run.change_dragarea;
document.getElementById('dragarea_option2').onchange = run.change_dragarea;
document.getElementById('dragarea_option3').onchange = run.change_dragarea;
document.getElementById('dragarea_option4').onchange = run.change_dragarea;
document.getElementById('dragarea_option5').onchange = run.change_dragarea;
document.getElementById('dragarea_option6').onchange = run.change_dragarea;
document.getElementById('dragarea_option7').onchange = run.change_dragarea;
document.getElementById('dragarea_option8').onchange = run.change_dragarea;
//document.getElementById('owmkey').onchange = run.change_owmkey;

$('[name="shownumbers"]').bootstrapSwitch();
$('[name="debuglogging"]').bootstrapSwitch();
$('input[name="shownumbers"]').on('switchChange.bootstrapSwitch', run.change_shownumbers);
$('input[name="debuglogging"]').on('switchChange.bootstrapSwitch', run.change_debuglogging);

document.airbar = new ProgressBar.Path('#path-air', {
  easing: 'easeInOut',
  duration: 1000
});
document.airbar.set(0);
document.positivewindbar = new ProgressBar.Path('#path-positive-wind', {
  easing: 'easeInOut',
  duration: 1000
});
document.positivewindbar.set(0);
document.negativewindbar = new ProgressBar.Path('#path-negative-wind', {
  easing: 'easeInOut',
  duration: 1000
});
document.negativewindbar.set(0);

// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', '@googleanalyticskey@', 'auto');
ga('send', 'pageview');