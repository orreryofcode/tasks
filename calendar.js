/*TO-DO: 
  1. Fix color filling of boxes based on selected color
  2. Map last selected color to box saved in localStorage (key-value pair relationship)
  3. Add a 'clear' button that resets the entire heatmap to white to easily wipe old data
*/

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

  /* Conditional below should actually be based on the selected color and the color of the square
    ex: if you select the color red and the box is already red -> box should change to white
    however, if you select any other color and the box is a color that isn't the one you selected -> box should change to selected color
  */

  if (
    box.style.fill === "red" ||
    box.style.fill === "green" ||
    box.style.fill === "blue"
  ) {
    box.style.fill = "#ededed";
    let index = boxes.indexOf(selected);
    boxes.splice(index, 1);
  } else {
    box.style.fill = color;
    boxes.push(selected);
  }

  // Need to store 'boxes' as a key-value pair relationship where the t value of the box is the key and the last selected color is the value
  localStorage.setItem("save", JSON.stringify(boxes));
});

// Heat map event listener that retrieves the styling saved in localStorage and applies it to the boxes that were last selected
cal.on("fill", () => {
  // Boxes are red on page refresh/load because the the fill color is hard coded as red: see comment on for localStorage setItem in cal click event listener
  let data = localStorage.getItem("save");

  const cells = document.querySelectorAll(".graph-rect");

  cells.forEach((cell) => {
    if (data && data.includes(cell.__data__["t"])) {
      cell.style.fill = "red";
    }
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
