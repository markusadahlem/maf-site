function setVisible(el, show) {
  if (el) el.style.display = show ? "block" : "none";
}

export function bindExclusiveCheckboxGroup({
  checkboxes,
  exclusiveValue,
  onChange,
}) {
  const all = Array.from(checkboxes);
  const exclusiveBox = all.find((cb) => cb.value === exclusiveValue);

  all.forEach((box) => {
    box.addEventListener("change", () => {
      if (box === exclusiveBox && box.checked) {
        all.forEach((other) => {
          if (other !== box) other.checked = false;
        });
      } else if (box !== exclusiveBox && box.checked && exclusiveBox) {
        exclusiveBox.checked = false;
      }
      onChange?.();
    });
  });
}

export function bindOtherTextarea({
  trigger,
  showWhenChecked = [],
  hideWhenChecked = [],
  textarea,
  counter,
  maxLength = 80,
  onChange,
}) {
  const updateCounter = () => {
    if (!counter) return;
    const len = textarea.value.length;
    counter.textContent = `${len} / ${maxLength} characters`;
    counter.style.display = len > 0 ? "block" : "none";
  };

  const sync = () => {
    const show = trigger.checked;
    showWhenChecked.forEach((el) => setVisible(el, show));
    hideWhenChecked.forEach((el) => setVisible(el, !show));
    if (show) {
      updateCounter();
    } else {
      textarea.value = "";
      if (counter) counter.style.display = "none";
    }
    onChange?.();
  };

  trigger.addEventListener("change", sync);
  textarea.addEventListener("input", () => {
    updateCounter();
    onChange?.();
  });

  sync();
}

export function bindContinueButton({ button, isReady }) {
  const update = () => {
    button.style.display = isReady() ? "inline-block" : "none";
  };
  update();
  return update;
}
