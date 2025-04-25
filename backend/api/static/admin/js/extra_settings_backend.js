(function($) {
  $(document).ready(function() {
    var resultsEl = $("#changelist-form");
    var tableEl = resultsEl.find("#result_list");
    var rowsEl = tableEl.find("tbody tr");

    // First show the Type column and hide all value columns in header
    tableEl.find("thead th").each(function(index, el) {
      var header = $(el);
      var text = header.find(".text span").text();

      // Keep Type column and first Value column visible, hide others
      if (text !== "Type" && text !== "Name" && text !== "Beschreibung" && !header.hasClass('action-checkbox')) {
        if (text === "Value") {
          if (tableEl.find("thead th .text span:contains('Value'):visible").length >= 2) {
            header.hide();
          }
      }
      }


    });

    // Handle rows
    rowsEl.each(function(index, el) {
      var row = $(el);
      var valueType = row.find(".field-value_type").text().trim();

      // Show the type column
      row.find(".field-value_type").show();

      // Hide all value columns first
      row.find("td[class^='field-value_']").not(".field-value_type").hide();

      // Show only the matching value column
      if (valueType) {
        row.find(".field-value_" + valueType.toLowerCase()).show();
      }
    });

    // Mark form as ready
    resultsEl.addClass("extra-settings-ready");
  });
})(django.jQuery || window.jQuery);