<script>
function toggleExplanation(key) {
  const el = document.getElementById("explain-" + key);
  if (el) el.style.display = el.style.display === "block" ? "none" : "block";
}

function handleCheckboxInteraction(clickedBox) {
  const form = clickedBox.closest("form");
  if (!form) return;

  const allBoxes = form.querySelectorAll('input[name="' + clickedBox.name + '"]');
  const isNone = clickedBox.value === "none";

  if (isNone && clickedBox.checked) {
    allBoxes.forEach((box) => {
      if (box !== clickedBox) box.checked = false;
    });
  } else if (!isNone && clickedBox.checked) {
    const noneBox = form.querySelector('input[value="none"]');
    if (noneBox) noneBox.checked = false;
  }

  if (typeof evaluateCriterionB === "function") {
    evaluateCriterionB();
  }
}
</script>
