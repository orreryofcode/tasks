// Create instance of CalHeatmap
const cal = new CalHeatmap();

// Array to store the selected heatmap rectangles in localStorage
let boxes = [];

// Initialize a selected color for the heatmap
let color = "red";

// Grab all of the color options and add an event listener that modifies the selected color based on the option the user clicked on
const colorPicker = document.querySelectorAll(".color");

colorPicker.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    color = e.target.textContent;
  });
});

// Heatmap click event listener that changes the color of each box to the color that user selected
cal.on("click", (e) => {
  let box = e.target;
  let selected = box.__data__.t;

  let test = {
    box: "",
    color: "",
  };

  if (box.style.fill === color) {
    box.style.fill = "#ededed";
    let index = boxes.indexOf(selected);
    boxes.splice(index, 1);
  } else {
    box.style.fill = color;
    test.box = selected;
    test.color = box.style.fill;
    boxes.push(test);
  }

  // Need to store 'boxes' as a key-value pair relationship where the t value of the box is the key and the last selected color is the value
  localStorage.setItem("save", JSON.stringify(boxes));
});

// Heat map event listener that retrieves the styling saved in localStorage and applies it to the boxes that were last selected
cal.on("fill", () => {
  // Boxes are red on page refresh/load because the the fill color is hard coded as red: see comment on for localStorage setItem in cal click event listener
  let data = JSON.parse(localStorage.getItem("save"));

  const cells = document.querySelectorAll(".graph-rect");

  cells.forEach((cell) => {
    data.forEach((entry) => {
      if (entry && cell.__data__["t"] === entry.box) {
        cell.style.fill = entry.color;
      }
    });
  });
});

// Heatmap options
const options = {
  itemSelector: "#cal-heatmap",
  range: 7,
  domain: {
    type: "day",
    gutter: 30,
    label: {
      text: "ddd",
      textAlign: "middle",
      position: "top",
    },
  },
  subDomain: {
    type: "hour",
  },
  //   verticalOrientation: boolean,
  date: {
    start: new Date(),
    min: null,
    max: null,
  },
  // //   data: DataOptions,
  //   animationDuration: number,
  //   tooltip: TooltipOptions,
  //   legend: LegendOptions,
};

// Call paint method on heatmap calendar to create the heatmap
cal.paint(options);

// Clear painted calendar

function clearMap() {
  const cells = document.querySelectorAll(".graph-rect");
  cells.forEach((cell) => (cell.style.fill = "#ededed"));
  localStorage.clear();
}

const date = document.querySelector("#date");
date.textContent = new Date().toLocaleDateString("en");
