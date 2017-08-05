const MAP = {
  'w': 87,
  'a': 65,
  's': 83,
  'd': 68
};
module.exports = char => {
  const key = {};
  key.code = MAP[char];
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = event => {
    console.log(event.keyCode);
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) {
        key.press();
        event.preventDefault();
      }
      key.isDown = true;
      key.isUp = false;
    }
  };
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
        event.preventDefault();
      }
      key.isDown = false;
      key.isUp = true;
    }
  };
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  return key;
};