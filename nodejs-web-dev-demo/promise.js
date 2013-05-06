var jqxhr = $.ajax("example.php").done(function() {
    alert("success");
}).fail(function() {
    alert("error");
}).always(function() {
    alert("complete");
});