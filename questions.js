var questions = [];
var i = 0;
var count = 0;
var score = 0;
var Ansgiven = []; // Store answers given by the user
var previousQuestionIndex = null; // Track the previously displayed question
var topicName = ''; // Variable to store the topic name
const submitSound =document.getElementById("submit-sound");

const uniqueKey = "Assessment";


// Helper function to save data in local storage under the unique key
function saveToLocalStorage(key, value) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  storageData[key] = value;
  localStorage.setItem(uniqueKey, JSON.stringify(storageData));
}

function handleAreaModelInput() {
  // Get all editable input fields
  const inputFields = document.querySelectorAll('.input-box.editable');
  
  inputFields.forEach((input, index) => {
    input.oninput = function() {
      document.getElementById("subbtn").style.display = "inline-block";
      document.getElementById("nextbtn").style.display = "none";
      
      // Store the user's input for the CURRENT question only
      if (!Ansgiven[i]) Ansgiven[i] = new Array(inputFields.length).fill("");
      Ansgiven[i][index] = this.value.trim();
      
      // Update button styles
      handleAnswerChange();
    };
  });
}

function handleAreaModelLayout(randomQuestion, optionsElement) {
  // Clear existing content first
  document.getElementById("picdiv").classList.remove("col-md-7", "col-lg-7", "col-sm-7", "col-xs-7");
  document.getElementById("picdiv").classList.add("col-12");
  document.getElementById("picdiv").style.backgroundImage = 'none';
  document.getElementById("picdiv").style.boxShadow = 'none';

  // Make questiondiv take more space for input fields
  document.getElementById("questiondiv").classList.add("input");
  document.getElementById("questiondiv").classList.remove("col-md-5", "col-lg-5", "col-sm-5", "col-xs-5");
  document.getElementById("questiondiv").classList.add("col-md-10", "col-lg-10", "col-sm-10", "col-xs-10");

  document.getElementById("question_background").style.width='100%';
        document.getElementById("question_background").style.height='90%';
        document.getElementById("question_background").style.height='28em';

  // Adjust question position
  document.getElementById("question").style.top = '15%';
  document.getElementById("question").style.left = '50%';
  
  // Style the options container
  optionsElement.style.display = "flex";
  optionsElement.style.flexDirection = "column";
  optionsElement.style.alignItems = "center";
  optionsElement.style.gap = "15px";
  
  // Create a grid container for the area model
  const gridContainer = document.createElement("div");
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "repeat(3, 30%)";
  gridContainer.style.gap = "0px 20px";
  gridContainer.style.justifyContent = "center";
  gridContainer.style.alignItems = "center";
  gridContainer.style.marginTop = "30px";
  
  // Track input field counter
  let inputCounter = 0;
  
  // Process each row in the inputBox
  for (const rowKey in randomQuestion.inputBox) {
    let rowItems = randomQuestion.inputBox[rowKey];
    
    // Special handling for row2 and row3 - the main area model grid
    if (rowKey === "row2" || rowKey === "row3") {
      // Create cell for the first item (column headers/row headers)
      const headerCell = document.createElement("div");
      headerCell.style.gridColumn = "1";
      headerCell.style.gridRow = (parseInt(rowKey.replace("row", ""))).toString();
      headerCell.style.display = "flex";
      headerCell.style.justifyContent = "end";
      headerCell.style.alignItems = "center";
      
      // Add the row header (30, 4, etc.)
      var rowHeader = document.createElement("div");
      rowHeader.textContent = rowItems[0].operand;
      rowHeader.style.width = "60px";
      rowHeader.style.height = "60px";
      rowHeader.style.padding = "5px";
      rowHeader.style.backgroundColor = rowKey === "row2" ? "#FFDDC1" : "#D1E8E2"; // Different colors for different rows
      rowHeader.style.borderRadius = "6px";
      rowHeader.style.display = "flex";
      rowHeader.style.alignItems = "center";
      rowHeader.style.justifyContent = "center";
      rowHeader.style.fontSize = "1.8rem";
      rowHeader.style.fontWeight = "bold";
      rowHeader.style.border = "2px solid #888";
      
      headerCell.appendChild(rowHeader);
      gridContainer.appendChild(headerCell);
      
      // Create the area model cells
      const areaContainer = document.createElement("div");
      areaContainer.style.gridRow = (parseInt(rowKey.replace("row", ""))).toString();
      areaContainer.style.gridColumn = "2 / span 2";
      areaContainer.style.display = "flex";
      areaContainer.style.flexDirection = "row";
      areaContainer.style.gap = "0px";
      
      // Colors for the area cells
      const colors = rowKey === "row2" ? 
        ["#FFC3A0", "#E0BBE4"] : // Colors for row2
        ["#A0DAA9", "#E4C0BE"]; // Colors for row3
      
      // Create the two area cells
      for (let j = 1; j < rowItems.length - 1; j++) {
        const colorIndex = j - 1;
        
        // Create the colored cell
        var areaCell = document.createElement("div");
        areaCell.style.backgroundColor = colors[colorIndex];
        areaCell.style.width = "200px";
        areaCell.style.height = "80px";
        areaCell.style.padding = "5px";
        areaCell.style.borderRadius = "6px";
        areaCell.style.display = "flex";
        areaCell.style.alignItems = "center";
        areaCell.style.justifyContent = "center";
        areaCell.style.border = "2px solid #888";
        
        if (rowItems[j+1].operand === "") {
          // Create input field for area calculation
          var inputField = document.createElement("input");
          inputField.type = "text";
          inputField.placeholder = "";
          inputField.id = `input-${inputCounter}`;
          inputField.className = "input-box editable";
          inputField.style.width = "85%";
          inputField.style.height = "75%";
          inputField.style.fontSize = "2rem";
          inputField.style.textAlign = "center";
          inputField.style.borderRadius = "4px";
          inputField.style.border = "1px solid #ddd";
          
          // Pre-fill with saved answer if available for the current question
          if (Ansgiven[i] && Ansgiven[i][inputCounter]) {
            inputField.value = Ansgiven[i][inputCounter];
          }
          
          inputCounter++;
          
          // Listen for user input - FIX: Use a function that maintains the current index
          inputField.addEventListener('input', function() {
            document.getElementById("subbtn").style.display = "inline-block";
            document.getElementById("nextbtn").style.display = "none";
            
            // Store the answer for the CURRENT question only
            // FIX: Make a closure to capture the current question index and input index
            const currentQuestionIndex = i;
            const currentInputIndex = inputCounter - 1;
            
            if (!Ansgiven[currentQuestionIndex]) {
              Ansgiven[currentQuestionIndex] = [];
            }
            Ansgiven[currentQuestionIndex][currentInputIndex] = this.value;
            
            // Update button styles
            handleAnswerChange();
          });
          
          areaCell.appendChild(inputField);
        } else {
          // Use pre-filled value
          var textValue = document.createElement("span");
          textValue.textContent = rowItems[j+1].operand;
          textValue.style.fontSize = "2rem";
          textValue.style.fontWeight = "bold";
          areaCell.appendChild(textValue);
        }
        
        areaContainer.appendChild(areaCell);
      }
      
      gridContainer.appendChild(areaContainer);
    }
    // Handle row1 - column headers (top row)
    else if (rowKey === "row1") {
      // Create row container with offset for layout
      const headerRow = document.createElement("div");
      headerRow.style.gridRow = "1";
      headerRow.style.gridColumn = "2 / span 2";
      headerRow.style.display = "flex";
      headerRow.style.justifyContent = "space-around";
      headerRow.style.alignItems = "flex-end";
      headerRow.style.gap = "15px";
      headerRow.style.marginBottom = "10px";
      
      // Create the column headers
      rowItems.forEach((item, idx) => {
        var headerCell = document.createElement("div");
        headerCell.textContent = item.operand;
        headerCell.style.width = "120px";
        headerCell.style.height = "40px";
        headerCell.style.backgroundColor = "#FFE5B4";
        headerCell.style.borderRadius = "6px";
        headerCell.style.display = "flex";
        headerCell.style.alignItems = "center";
        headerCell.style.justifyContent = "center";
        headerCell.style.fontSize = "1.8rem";
        headerCell.style.fontWeight = "bold";
        headerCell.style.border = "2px solid #888";
        
        // Show operator if exists
        if (item.operator && item.operator !== "") {
          var operatorSpan = document.createElement("span");
          operatorSpan.textContent = item.operator;
          operatorSpan.style.marginLeft = "10px";
          operatorSpan.style.fontSize = "1.8rem";
          headerCell.appendChild(operatorSpan);
        }
        
        headerRow.appendChild(headerCell);
      });
      
      gridContainer.appendChild(headerRow);
    }
    // Handle row4 - final answer row
    else if (rowKey === "row4") {
      // Create a container for the final answer
      const answerRow = document.createElement("div");
      answerRow.style.gridRow = "4";
      answerRow.style.gridColumn = "1 / span 3";
      answerRow.style.display = "flex";
      answerRow.style.justifyContent = "center";
      answerRow.style.alignItems = "center";
      answerRow.style.gap = "5px";
      answerRow.style.marginTop = "15px";
      
      // Process each item in the answer row
      rowItems.forEach((item) => {
        if (item.operand !== "") {
          // Label for the equation
          var label = document.createElement("div");
          label.textContent = item.operand;
          label.style.fontSize = "";
          label.style.fontWeight = "bold";
          answerRow.appendChild(label);
        } else {
          // Input field for the final answer
          var finalAnswer = document.createElement("input");
          finalAnswer.type = "text";
          finalAnswer.placeholder = "";
          finalAnswer.id = `input-${inputCounter}`;
          finalAnswer.className = "input-box editable";
          finalAnswer.style.width = "120px";
          finalAnswer.style.height = "50px";
          finalAnswer.style.fontSize = "1.8rem";
          finalAnswer.style.textAlign = "center";
          finalAnswer.style.borderRadius = "4px";
          finalAnswer.style.border = "2px solid #6b8e23";
          
          // Pre-fill with saved answer if available for the current question
          if (Ansgiven[i] && Ansgiven[i][inputCounter]) {
            finalAnswer.value = Ansgiven[i][inputCounter];
          }
          
          inputCounter++;
          
          // Listen for user input - FIX: Use a function that maintains the current index
          finalAnswer.addEventListener('input', function() {
            document.getElementById("subbtn").style.display = "inline-block";
            document.getElementById("nextbtn").style.display = "none";
            
            // FIX: Make a closure to capture the current question index and input index
            const currentQuestionIndex = i;
            const currentInputIndex = inputCounter - 1;
            
            // Store the answer for the CURRENT question only
            if (!Ansgiven[currentQuestionIndex]) {
              Ansgiven[currentQuestionIndex] = [];
            }
            Ansgiven[currentQuestionIndex][currentInputIndex] = this.value;
            
            // Update button styles
            handleAnswerChange();
          });
          
          answerRow.appendChild(finalAnswer);
        }
      });
      
      gridContainer.appendChild(answerRow);
    }
  }
  
  // Add the entire grid to the options
  optionsElement.appendChild(gridContainer);
}
// Helper function to get data from local storage under the unique key
function getFromLocalStorage(key) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  return storageData[key];
}

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    // Get the selected topic from the URL
    const urlParams = new URLSearchParams(window.location.search);
    topicName = urlParams.get('topic'); // Store topic name for later use

    // Find the questions for the selected topic
    const selectedTopic = data.topics.find(t => t.heading === topicName);

    if (selectedTopic) {
      questions = selectedTopic.questions; // Access the questions array for the selected topic
      count = questions.length;

      // Store total number of questions in localStorage
      saveToLocalStorage(topicName + '_totalQuestions', count);

      // Load the heading from the selected topic
      document.getElementById('heading').innerText = topicName || 'Default Heading'; // Set default heading if not provided
      loadButtons();
      loadQuestion(i);

      // Retrieve topics from localStorage using your helper function
      const storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};  // Retrieve full storage data
      const topics = storageData['topics'] || []; // Get topics from storage data

      // Check if the selected topic is already stored to avoid duplicates
      if (!topics.find(t => t.heading === topicName)) {
        topics.push(selectedTopic); // Add the selected topic to the topics array
        storageData['topics'] = topics; // Update storageData with the new topics array
        localStorage.setItem(uniqueKey, JSON.stringify(storageData)); // Save updated storage back to localStorage
      }
    } else {
      document.getElementById('heading').innerText = 'Topic not found';
      document.getElementById('buttonContainer').innerHTML = 'No questions available for this topic.';
    }
  });


function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = ""; // Clear previous buttons
  for (var j = 0; j < questions.length; j++) {
    var btn = document.createElement("button");
    btn.className = "btn btn-default smallbtn";
    btn.innerHTML = "Q" + (j + 1);
    btn.setAttribute("onclick", "abc(" + (j + 1) + ")");
   if (getFromLocalStorage(topicName + '_completed')) {
    btn.classList.add("disabled-btn");
    btn.disabled = true;
    // console.log("Topic Completed Status:", getFromLocalStorage(topicName + '_completed'));

  }

buttonContainer.appendChild(btn);
  }
  // Highlight the button for the current question
  highlightButton(i);
  // Update button styles based on answered questions
  updateButtonStyles();

}
let currentSound = null; // Variable to keep track of the currently playing sound
function checkAllInputBoxesAnswered() {
  const allAnswered = questions.every(q => !q.inputBox || Ansgiven[questions.indexOf(q)]); // Adjust as needed for answer tracking
  if (allAnswered) {
    document.getElementById("picdiv").classList.remove("col-md-12", "col-lg-12", "col-sm-12", "col-xs-12");
    document.getElementById("picdiv").classList.add("col-md-7", "col-lg-7", "col-sm-7", "col-xs-7");
  }
}

function loadQuestion(index) {
  var randomQuestion = questions[index];
  if (!randomQuestion) {
    console.error("No question found at index:", index);
    return;
  }
 

  // Set question text
  var questionElement = document.getElementById("question");
  questionElement.innerHTML = randomQuestion.question;

  // Check if there is a sound associated with the question
  if (randomQuestion.questionSound) {
    var soundButton = document.createElement("button");
    soundButton.className = "btn btn-sound";
    soundButton.innerText = "🔊 Play Sound";
    soundButton.onclick = function() {
      var sound = new Audio(randomQuestion.questionSound);
      sound.play();
    };
    questionElement.appendChild(soundButton);
  }

  // Get the options element
  var optionsElement = document.getElementById("options");
  optionsElement.innerHTML = ""; // Clear existing options


   // Check if we're on a multiplication topic
   const isMultiplicationTopic = topicName === "Multiplication";
   const isDivisionTopic = topicName === "Division";
   // Check if question has inputBox (no options)
   if (randomQuestion.inputBox) {
     if (topicName === "Area Model") {
       handleAreaModelLayout(randomQuestion, optionsElement);
     }
     else if (isMultiplicationTopic) {
       if (index === 0) {
         // Use code from paste-2.txt for the first question
         document.getElementById("picdiv").classList.remove("col-md-7", "col-lg-7", "col-sm-7", "col-xs-7");
         document.getElementById("picdiv").classList.add("col-12");
         document.getElementById("picdiv").style.backgroundImage = 'none';
         document.getElementById("picdiv").style.boxShadow = 'none';
       
         // Make questiondiv take more space for input fields
         document.getElementById("questiondiv").classList.add("input");
         document.getElementById("questiondiv").classList.remove("col-md-5", "col-lg-5", "col-sm-5", "col-xs-5");
         document.getElementById("questiondiv").classList.add("col-md-10", "col-lg-10", "col-sm-10", "col-xs-10");

         document.getElementById("question_background").style.width='100%';
        document.getElementById("question_background").style.height='90%';
        document.getElementById("question_background").style.height='28em';
       
         // Adjust question position
         document.getElementById("question").style.top = '15%';
         document.getElementById("question").style.left = '50%';
         document.querySelector(".input").style.top='55%';
         
         // Change to display flex with column direction for multiple rows
         optionsElement.style.display = "flex";
         optionsElement.style.flexDirection = "column";
         optionsElement.style.alignItems = "center";
         optionsElement.style.gap = "10px"; // Add gap between rows
 
         // Create a table structure for proper alignment
         const tableElement = document.createElement("table");
         tableElement.className = "input-table";
         tableElement.style.borderCollapse = "collapse";
         tableElement.style.width = "auto";
         tableElement.style.margin = "0 auto";
         
         let inputCounter = 0;
         let rowCount = 0;
         
         // First determine how many columns we need by finding the row with the most items
         let maxColumns = 0;
         for (const rowKey in randomQuestion.inputBox) {
           maxColumns = Math.max(maxColumns, randomQuestion.inputBox[rowKey].length);
         }
         
         // Process each row in the inputBox
         for (const rowKey in randomQuestion.inputBox) {
           // Create table row
           const tr = document.createElement("tr");
           tr.style.textAlign = "center";
           
           // Add horizontal line after row 3 (before row 4)
           if (rowCount === 3) {
             tr.style.borderTop = "2px solid #000";
             tr.style.marginTop = "5px";
           }
           
           const currentRow = randomQuestion.inputBox[rowKey];

           const isRow1 = rowCount === 0; // Index 2 is the third row
           
           // If this is row 3 and has fewer elements than maxColumns, add empty cells at the beginning
           if (isRow1 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }

           const isRow2 = rowCount === 1; // Index 2 is the third row
           
           // If this is row 3 and has fewer elements than maxColumns, add empty cells at the beginning
           if (isRow2 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
           
           // Special handling for row 3 (index 2) to right-align inputs
           const isRow3 = rowCount === 2; // Index 2 is the third row
           
           // If this is row 3 and has fewer elements than maxColumns, add empty cells at the beginning
           if (isRow3 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
           
           // Create cells for each column position
           for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
             const td = document.createElement("td");
             td.style.padding = "5px 15px";
             td.style.minWidth = "80px";
             td.style.textAlign = "center";
             
             const item = currentRow[colIndex];
             
             if (item.operand !== "") {
               // Create a span element for pre-filled values
               const textSpan = document.createElement("span");
               textSpan.textContent = item.operand;
               textSpan.className = "pre-filled-text";
               textSpan.style.fontSize = "2.4rem";
               textSpan.style.fontWeight = "700";
               textSpan.style.padding = "5px";
               textSpan.style.display = "inline-block";
               textSpan.style.minWidth = "60px";
               td.appendChild(textSpan);
             } else {
               // Create input field for empty values
               const inputField = document.createElement("input");
               inputField.type = "text";
               inputField.placeholder = "";
               inputField.id = `input-${inputCounter}`;
               inputField.className = "input-box editable";
               inputField.style.width = "60px";
               inputField.style.height = "50px";
               inputField.style.fontSize = "2.4rem";
               inputField.style.textAlign = "center";
               inputCounter++;
               
               // Listen for user input
               inputField.oninput = function() {
                 document.getElementById("subbtn").style.display = "inline-block";
                 document.getElementById("nextbtn").style.display = "none";
               };
               
               td.appendChild(inputField);
             }
             
             // Add operators if provided
             if (item.operator && item.operator !== "") {
               const operatorSpan = document.createElement("span");
               operatorSpan.textContent = item.operator;
               operatorSpan.style.marginLeft = "5px";
               operatorSpan.style.fontSize = "1.8rem";
               td.appendChild(operatorSpan);
             }
             
             tr.appendChild(td);
           }
           
           // If this is NOT row 3 and has fewer elements than maxColumns, add empty cells at the end
           if (!isRow3 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
           
           tableElement.appendChild(tr);
           rowCount++;
         }
         
         optionsElement.appendChild(tableElement);
       } else {
         // Use code from paste-3.txt for other questions
         document.getElementById("picdiv").classList.remove("col-md-7", "col-lg-7", "col-sm-7", "col-xs-7");
         document.getElementById("picdiv").classList.add("col-12");
         document.getElementById("picdiv").style.backgroundImage = 'none';
         document.getElementById("picdiv").style.boxShadow = 'none';
       
         // Make questiondiv take more space for input fields
         document.getElementById("questiondiv").classList.add("input");
         document.getElementById("questiondiv").classList.remove("col-md-5", "col-lg-5", "col-sm-5", "col-xs-5");
         document.getElementById("questiondiv").classList.add("col-md-10", "col-lg-10", "col-sm-10", "col-xs-10");
         document.getElementById("question_background").style.width='100%';
        document.getElementById("question_background").style.height='90%';
        document.getElementById("question_background").style.height='28em';
        document.querySelector(".input").style.top='55%';
       
         // Adjust question position
         document.getElementById("question").style.top = '15%';
         document.getElementById("question").style.left = '50%';
         
         // Change to display flex with column direction for multiple rows
         optionsElement.style.display = "flex";
         optionsElement.style.flexDirection = "column";
         optionsElement.style.alignItems = "center";
         optionsElement.style.gap = "10px"; // Add gap between rows
 
         // Create a table structure for proper alignment
         const tableElement = document.createElement("table");
         tableElement.className = "input-table";
         tableElement.style.borderCollapse = "collapse";
         tableElement.style.width = "auto";
         tableElement.style.margin = "0 auto";
         
         let inputCounter = 0;
         let rowCount = 0;
         
         // First determine how many columns we need by finding the row with the most items
         let maxColumns = 0;
         for (const rowKey in randomQuestion.inputBox) {
           maxColumns = Math.max(maxColumns, randomQuestion.inputBox[rowKey].length);
         }
         
         // Process each row in the inputBox
         for (const rowKey in randomQuestion.inputBox) {
           // Create table row
           const tr = document.createElement("tr");
           tr.style.textAlign = "center";
           
           // Add horizontal line after row 4 (before row 5)
           if (rowCount === 4) {
             tr.style.borderTop = "2px solid #000";
             tr.style.marginTop = "5px";
           }
           
           const currentRow = randomQuestion.inputBox[rowKey];
           
           // Special handling for row 3 (index 2) to right-align inputs
           const isRow3 = rowCount === 2; // Index 2 is the third row
           
           // If this is row 3 and has fewer elements than maxColumns, add empty cells at the beginning
           if (isRow3 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
 
           // Special handling for row 4 (index 3) to right-align inputs
           const isRow4 = rowCount === 3; // Index 3 is the fourth row
           
           // If this is row 4 and has fewer elements than maxColumns, add empty cells at the beginning
           if (isRow4 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
           
           // Create cells for each column position
           for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
             const td = document.createElement("td");
             td.style.padding = "5px 15px";
             td.style.minWidth = "80px";
             td.style.textAlign = "center";
             
             const item = currentRow[colIndex];
             
             if (item.operand !== "") {
               // Create a span element for pre-filled values
               const textSpan = document.createElement("span");
               textSpan.textContent = item.operand;
               textSpan.className = "pre-filled-text";
               textSpan.style.fontSize = "2.4rem";
               textSpan.style.padding = "5px";
               textSpan.style.display = "inline-block";
               textSpan.style.minWidth = "60px";
               td.appendChild(textSpan);
             } else {
               // Create input field for empty values
               const inputField = document.createElement("input");
               inputField.type = "text";
               inputField.placeholder = "";
               inputField.id = `input-${inputCounter}`;
               inputField.className = "input-box editable";
               inputField.style.width = "60px";
               inputField.style.height = "50px";
               inputField.style.fontSize = "2.4rem";
               inputField.style.textAlign = "center";
               inputCounter++;
               
               // Listen for user input
               inputField.oninput = function() {
                 document.getElementById("subbtn").style.display = "inline-block";
                 document.getElementById("nextbtn").style.display = "none";
               };
               
               td.appendChild(inputField);
             }
             
             // Add operators if provided
             if (item.operator && item.operator !== "") {
               const operatorSpan = document.createElement("span");
               operatorSpan.textContent = item.operator;
               operatorSpan.style.marginLeft = "5px";
               operatorSpan.style.fontSize = "2.5rem";
               td.appendChild(operatorSpan);
             }
             
             tr.appendChild(td);
           }
           
           // If this is NOT row 3 or row 4 and has fewer elements than maxColumns, add empty cells at the end
           if (!isRow3 && !isRow4 && currentRow.length < maxColumns) {
             const emptyCellsNeeded = maxColumns - currentRow.length;
             for (let i = 0; i < emptyCellsNeeded; i++) {
               const emptyTd = document.createElement("td");
               emptyTd.style.padding = "5px 15px";
               emptyTd.style.minWidth = "80px";
               tr.appendChild(emptyTd);
             }
           }
           
           tableElement.appendChild(tr);
           rowCount++;
         }
         
         optionsElement.appendChild(tableElement);
       }
     }
     else if (isDivisionTopic) {
      if (index === 0) {
        // Use code from paste-2.txt for the first question
        document.getElementById("picdiv").classList.remove("col-md-7", "col-lg-7", "col-sm-7", "col-xs-7");
        document.getElementById("picdiv").classList.add("col-12");
        document.getElementById("picdiv").style.backgroundImage = 'none';
        document.getElementById("picdiv").style.boxShadow = 'none';
      
        // Make questiondiv take more space for input fields
        document.getElementById("questiondiv").classList.add("input");
        document.getElementById("questiondiv").classList.remove("col-md-5", "col-lg-5", "col-sm-5", "col-xs-5");
        document.getElementById("questiondiv").classList.add("col-md-10", "col-lg-10", "col-sm-10", "col-xs-10");

        document.getElementById("question_background").style.width='100%';
       document.getElementById("question_background").style.height='90%';
       document.getElementById("question_background").style.height='28em';
      
        // Adjust question position
        document.getElementById("question").style.top = '33%';
        document.getElementById("question").style.left = '50%';
        document.querySelector(".input").style.top='73%';
        
        // Change to display flex with column direction for multiple rows
        optionsElement.style.display = "flex";
        optionsElement.style.flexDirection = "column";
        optionsElement.style.alignItems = "center";
        optionsElement.style.gap = "10px"; // Add gap between rows

        // Create a table structure for proper alignment
        const tableElement = document.createElement("table");
        tableElement.className = "input-table";
        tableElement.style.borderCollapse = "collapse";
        tableElement.style.width = "auto";
        tableElement.style.margin = "0 auto";
        
        let inputCounter = 0;
        let rowCount = 0;
        
        // First determine how many columns we need by finding the row with the most items
        let maxColumns = 0;
        for (const rowKey in randomQuestion.inputBox) {
          maxColumns = Math.max(maxColumns, randomQuestion.inputBox[rowKey].length);
        }
        
        // Process each row in the inputBox
        for (const rowKey in randomQuestion.inputBox) {
          // Create table row
          const tr = document.createElement("tr");
          tr.style.textAlign = "center";
          
          // Add horizontal line after row 3 (before row 4)
          if (rowCount === 3) {
            tr.style.borderTop = "2px solid #000";
            tr.style.marginTop = "5px";
          }
          
          const currentRow = randomQuestion.inputBox[rowKey];

        
          // Special handling for row 3 (index 2) to right-align inputs
          const isRow3 = rowCount === 2; // Index 2 is the third row

          // Create cells for each column position
          for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
            const td = document.createElement("td");
            td.style.padding = "5px 15px";
            td.style.minWidth = "80px";
            td.style.textAlign = "center";
            
            const item = currentRow[colIndex];
            
            if (item.operand !== "") {
              // Create a span element for pre-filled values
              const textSpan = document.createElement("span");
              textSpan.textContent = item.operand;
              textSpan.className = "pre-filled-text";
              textSpan.style.fontSize = "2.4rem";
              textSpan.style.fontWeight = "700";
              textSpan.style.padding = "5px";
              textSpan.style.display = "inline-block";
              textSpan.style.minWidth = "60px";
              td.appendChild(textSpan);
            } else {
              // Create input field for empty values
              const inputField = document.createElement("input");
              inputField.type = "text";
              inputField.placeholder = "";
              inputField.id = `input-${inputCounter}`;
              inputField.className = "input-box editable";
              inputField.style.width = "60px";
              inputField.style.height = "50px";
              inputField.style.fontSize = "2.4rem";
              inputField.style.textAlign = "center";
              inputCounter++;
              
              // Listen for user input
              inputField.oninput = function() {
                document.getElementById("subbtn").style.display = "inline-block";
                document.getElementById("nextbtn").style.display = "none";
              };
              
              td.appendChild(inputField);
            }
            
            // Add operators if provided
            if (item.operator && item.operator !== "") {
              const operatorSpan = document.createElement("span");
              operatorSpan.textContent = item.operator;
              operatorSpan.style.marginLeft = "5px";
              operatorSpan.style.fontSize = "1.8rem";
              td.appendChild(operatorSpan);
            }
            
            tr.appendChild(td);
          }
          
          // If this is NOT row 3 and has fewer elements than maxColumns, add empty cells at the end
          if (!isRow3 && currentRow.length < maxColumns) {
            const emptyCellsNeeded = maxColumns - currentRow.length;
            for (let i = 0; i < emptyCellsNeeded; i++) {
              const emptyTd = document.createElement("td");
              emptyTd.style.padding = "5px 15px";
              emptyTd.style.minWidth = "80px";
              tr.appendChild(emptyTd);
            }
          }
          
          tableElement.appendChild(tr);
          rowCount++;
        }
        
        optionsElement.appendChild(tableElement);
      }
    }
      else {
    
        document.getElementById("picdiv").classList.add("picdiv");
        document.getElementById("picdiv").classList.remove("col-md-7");
        document.getElementById("picdiv").classList.remove("col-lg-7");
        document.getElementById("picdiv").classList.remove("col-sm-7");
        document.getElementById("picdiv").classList.remove("col-xs-7");
        document.getElementById("picdiv").classList.add("col-md-12");
        document.getElementById("picdiv").classList.add("col-lg-12");
        document.getElementById("picdiv").classList.add("col-sm-12");
        document.getElementById("picdiv").classList.add("col-xs-12");
        document.getElementById("questiondiv").classList.add("input");
        document.getElementById("questiondiv").classList.remove("col-md-5");
        document.getElementById("questiondiv").classList.remove("col-lg-5");
        document.getElementById("questiondiv").classList.remove("col-sm-5");
        document.getElementById("questiondiv").classList.remove("col-xs-5");
        document.getElementById("questiondiv").classList.add("col-md-10");
        document.getElementById("questiondiv").classList.add("col-lg-10");
        document.getElementById("questiondiv").classList.add("col-sm-10");
        document.getElementById("questiondiv").classList.add("col-xs-10");
        document.getElementById("question_background").classList.remove("img-responsive");
        document.getElementById("question_background").style.width='100%';
        document.getElementById("question_background").style.height='90%';
        document.getElementById("question_background").style.height='28em';
        document.getElementById("question").style.top='35%';
        document.getElementById("question").style.left='50%';
        document.querySelector(".input").style.top='73%';
        const menu = document.getElementsByTagName("ul");
        if (menu.length > 0) {
            menu[0].style.display = 'flex';
            menu[0].style.fontSize= '2.4vw'; 
            menu[0].style.textAlign= 'center';
            menu[0].style.flexDirection= 'row';
            menu[0].style.justifyContent = 'center';
            menu[0].style.gap= '2%';// Set display of the first (or only) menu element
        }
    
       
        randomQuestion.inputBox.forEach((item, idx) => {
          if (item.operand === "" || item.operator === "") {
            var input = document.createElement("input");
            input.type = "text";
            input.className = "answer-input";
            input.placeholder = "";
            input.value = Ansgiven[i] && Ansgiven[i][idx] ? Ansgiven[i][idx] : "";  // Pre-fill the input with the saved answer
            input.oninput = function() {
              // Do not automatically submit, just enable the submit button
              handleAnswerChange();
              checkAllInputBoxesAnswered();
            };
            optionsElement.appendChild(input);
          } else {
            var textNode = document.createTextNode(item.operand || item.operator);
            optionsElement.appendChild(textNode);
          }
        });
        
      }
    } else if (randomQuestion.options) {
    var mainDiv = document.getElementsByClassName("maindiv")[0];

if (mainDiv) {
    mainDiv.style.display = 'flex';
} else {
    console.error('No element with class "maindiv" found');
}
document.getElementById("picdiv").classList.add("col-md-7");
  document.getElementById("picdiv").classList.add("col-lg-7");
  document.getElementById("picdiv").classList.add("col-sm-7");
  document.getElementById("picdiv").classList.add("col-xs-7");
    document.getElementById("questiondiv").classList.remove("input");
    document.getElementById("questiondiv").classList.add("col-md-5");
    document.getElementById("questiondiv").classList.add("col-lg-5");
    document.getElementById("questiondiv").classList.add("col-sm-5");
    document.getElementById("questiondiv").classList.add("col-xs-5");
    document.getElementById("questiondiv").classList.remove("col-md-10");
    document.getElementById("questiondiv").classList.remove("col-lg-10");
    document.getElementById("questiondiv").classList.remove("col-sm-10");
    document.getElementById("questiondiv").classList.remove("col-xs-10");
    document.getElementById("picdiv").classList.remove("picdiv");
    document.getElementById("question_background").classList.add("img-responsive");
    document.getElementById("question_background").style.width='100%';
    document.getElementById("question_background").style.height='100%';
    document.getElementById("question").style.top='50%';
    document.getElementById("question").style.left='46%';
    // Display options if they exist
    var hasImageOptions = randomQuestion.options.some(option => option.image);
    var hasTextOnlyOptions = randomQuestion.options.every(option => !option.image);

    if (hasImageOptions) {
      optionsElement.classList.add("grid-layout");
      optionsElement.style.display = "grid";
    // optionsElement.style.gridTemplateColumns = "repeat(2, 1fr)"; // 2 images per row
    optionsElement.style.gap = "2px"; // Add space between images
    } else if (hasTextOnlyOptions) {
      optionsElement.classList.add("text-only");
      optionsElement.style.display="block";
    }

    var selectedLi = null;
    randomQuestion.options.forEach(function(option, idx) {
      var li = document.createElement("li");
      li.classList.add("option-container");
      
      li.onclick = function() {
        if (selectedLi) {
          selectedLi.style.border = "";
          selectedLi.style.background = "none";
        }
        li.style.border = "3px solid";
        li.style.borderRadius = "8px";
        li.style.background = "#E2BFD9";
        selectedLi = li;
        // Do not submit here, only enable submit button
        handleAnswerChange();
      };

      var radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "answer";
      radioButton.value = idx;
      radioButton.style.display = "none";

      if (option.image) {
        var optionImage = document.createElement("img");
        optionImage.src = option.image;
        optionImage.alt = "Option Image";
        optionImage.style.width = "85%";
        optionImage.style.cursor = "pointer";
        optionImage.style.borderRadius = "12px";

        optionImage.onclick = function() {
          radioButton.checked = true;
          // Enable the submit button only, do not submit yet
          handleAnswerChange();
        };
        li.appendChild(optionImage);
      } else {
        document.getElementById("questiondiv").classList.remove("input");
        var optionTextButton = document.createElement("button");
        optionTextButton.className = "btnOption btn btn-option";
        optionTextButton.innerHTML = option.text;
        optionTextButton.onclick = function() {
          radioButton.checked = true;
          // Enable the submit button only, do not submit yet
          handleAnswerChange();
        };
        li.appendChild(optionTextButton);
      }

      li.appendChild(radioButton);
      optionsElement.appendChild(li);
    });
  }

  // Restore previously selected answer if it exists
  var previouslySelected = Ansgiven[index];
  if (previouslySelected !== null && previouslySelected !== undefined) {
    var previouslySelectedElement = optionsElement.querySelector('input[name="answer"][value="' + previouslySelected + '"]');
    if (previouslySelectedElement) {
      previouslySelectedElement.checked = true;

      var previouslySelectedLi = previouslySelectedElement.closest('li');
      if (previouslySelectedLi) {
        previouslySelectedLi.style.border = "3px solid";
        previouslySelectedLi.style.borderRadius = "8px";
        selectedLi = previouslySelectedLi;
      }
    }
  }

  // Update button visibility and styles
  updateButtonVisibility();
  highlightButton(index);
  updateButtonStyles();
  updateButtonText();
}

function playOptionSound(option) {
  var sound = new Audio(option);
  sound.play();
}


function playSound(soundFile) {
  var audio = new Audio(soundFile);
  audio.play();
}



// Save the answer for the current question
function saveCurrentAnswer() {
  // Get multiple-choice selected answer
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');

  // Check if it's a multiple-choice question
  if (selectedAnswer) {
    Ansgiven[i] = parseInt(selectedAnswer.value); // Store answer as an index
  } else {
    // For questions with input boxes, collect values from all inputs
    var inputFields = document.querySelectorAll('.input-box.editable, .answer-input');
    if (inputFields.length > 0) {
      // Create an array to store input values for the CURRENT question only
      var inputValues = Array.from(inputFields).map(input => input.value.trim());
      
      // Check if all input fields are empty
      var allEmpty = inputValues.every(value => value === "");

      if (allEmpty) {
        Ansgiven[i] = null; // Mark as not answered
      } else {
        // Save all input values for THIS question only
        Ansgiven[i] = inputValues;
      }
    } else {
      Ansgiven[i] = null; // Mark as not answered if neither options nor inputs are present
    }
  }

  saveToLocalStorage('Ansgiven', Ansgiven); // Save the updated answers array to local storage
  updateButtonStyles(); // Ensure that button style is updated after submitting
}



function handleAnswerChange() {
  // Show the Submit Answer button and hide the Next button when an answer is selected
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";
}

function newques() {
  // Save the answer for the current question
  saveCurrentAnswer();

  if (i === count - 1) {
    // Display results
    displayResults();
    // Hide buttonContainer
    document.getElementById("buttonContainer").style.display = "none";
    document.getElementById("questiondiv").style.padding = "3rem";

    document.getElementById("questiondiv").style.backgroundColor = "#8FD8D2";
  
  } else {
    // Move to the next question
    i++;
    loadQuestion(i);
    document.getElementById("result").innerHTML = "";
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
    
    // Update button visibility and styles
    updateButtonVisibility();
    updateButtonStyles();
  }
}

function displayResults() {
  // Calculate the score based on saved answers
  score = 0; // Reset score
  console.log("Starting score calculation. Questions:", questions.length);
  
  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];
    const userAnswer = Ansgiven[index];
    const correctAnswer = question.answer;
    
    console.log(`Question ${index + 1}:`, question.question);
    console.log("User answer:", userAnswer);
    console.log("Correct answer:", correctAnswer);
    
    if (userAnswer === undefined || userAnswer === null) {
      console.log("Skipping unanswered question");
      continue; // Skip unanswered questions
    }
    
    if (question.options) {
      // Multiple-choice question
      if (userAnswer === correctAnswer) {
        console.log("Multiple choice correct!");
        score += 1;
      } else {
        console.log("Multiple choice incorrect");
      }
    } else if (question.inputBox) {
      // Input box question (including area model)
      
      // Handle both single input and multiple input cases
      if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
        // Multiple input case
        console.log("Checking multiple inputs");
        let allCorrect = true;
        
        // Compare each input with its corresponding correct answer
        for (let i = 0; i < Math.min(userAnswer.length, correctAnswer.length); i++) {
          // Normalize answers for comparison (trim whitespace and convert to strings)
          const normalizedUserAnswer = String(userAnswer[i] || "").trim();
          const normalizedCorrectAnswer = String(correctAnswer[i] || "").trim();
          
          console.log(`Input ${i + 1}: User="${normalizedUserAnswer}", Correct="${normalizedCorrectAnswer}"`);
          
          // Compare normalized answers
          if (normalizedUserAnswer !== normalizedCorrectAnswer) {
            allCorrect = false;
            console.log(`Input ${i + 1} is incorrect`);
            break;
          }
        }
        
        // Additional check for length mismatch
        if (userAnswer.length !== correctAnswer.length) {
          allCorrect = false;
          console.log("Input count mismatch");
        }
        
        // Award points if all inputs are correct
        if (allCorrect) {
          console.log("All inputs correct! +1 point");
          score += 1;
        }
      } else {
        // Single input case
        const normalizedUserAnswer = String(userAnswer).trim();
        const normalizedCorrectAnswer = String(correctAnswer).trim();
        
        console.log(`Single input: User="${normalizedUserAnswer}", Correct="${normalizedCorrectAnswer}"`);
        
        if (normalizedUserAnswer === normalizedCorrectAnswer) {
          console.log("Single input correct! +1 point");
          score += 1;
        } else {
          console.log("Single input incorrect");
        }
      }
    }
  }

  console.log("Final score:", score);

  // Save score and completion status to local storage
  saveToLocalStorage(topicName + '_score', score);
  saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

  // Hide certain elements
  document.getElementById("question_background").style.display = "none";
  document.getElementById("question").style.display = "none";
  document.getElementById("nextbtn").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("options").style.display = "none";
  document.getElementById("head").innerHTML = "Check Your Answers";

  // Calculate percentage and feedback message
  var percentage = (score / questions.length) * 100;
  var progressBarColor = "";
  var feedbackMessage = "";
  if (percentage <= 40) {
    progressBarColor = "#F28D8D"; /* Dark Pastel Red */
    feedbackMessage = "You may need more practice.";
  } else if (percentage > 40 && percentage <= 70) {
    progressBarColor = "#6C8EBF"; /* Dark Pastel Blue */
    feedbackMessage = "Well done!";
  } else if (percentage > 70) {
    progressBarColor = "#B5E7A0"; /* Dark Pastel Green */
    feedbackMessage = "Excellent job!";
  }

  // Set up feedback section
  var mainDiv = document.getElementsByClassName("maindiv")[0];

  if (mainDiv) {
    mainDiv.style.display = 'flex';
  } else {
    console.error('No element with class "maindiv" found');
  }
  
  document.getElementById("picdiv").classList.remove("col-md-12");
  document.getElementById("picdiv").classList.remove("col-lg-12");
  document.getElementById("picdiv").classList.remove("col-sm-12");
  document.getElementById("picdiv").classList.remove("col-xs-12");
  document.getElementById("picdiv").classList.add("col-md-7");
  document.getElementById("picdiv").classList.add("col-lg-7");
  document.getElementById("picdiv").classList.add("col-sm-7");
  document.getElementById("picdiv").classList.add("col-xs-7");
  document.getElementById("picdiv").style.backgroundColor = "#B7A0D0"; /* Dark Pastel Lavender */
  document.getElementById("picdiv").style.fontSize = "1.8rem"; /* Larger font size for feedback */
  document.getElementById("picdiv").style.textAlign = "center";
  document.getElementById("picdiv").style.color = "#333"; /* Darker color for text */

  var Dis = "<br><br><br><br><br><br><br>Score: " + score + "/" + questions.length + "<br><br>";
  var home = "<a href='index.html'><b class='btn btn-success next-btn-progress'>Next</b></a><br>";
  var content = Dis + feedbackMessage + "<br><div class='progress'> <div class='progress-bar' role='progressbar' aria-valuenow='" + percentage + "' aria-valuemin='0' aria-valuemax='100' style='width:" + percentage + "%;background-color:" + progressBarColor + ";'> </div></div>" + home;

  // Store the results content in local storage with a unique key
  saveToLocalStorage(topicName + '_results_content', content);

  // Prepare question and answer details
  var questionContent = "";
  document.getElementById("questiondiv").classList.remove("input");
  document.getElementById("questiondiv").style.textAlign = "left";
  document.getElementById("questiondiv").style.color = "black";
  document.getElementById("questiondiv").style.fontSize = "18px";
  document.getElementById("questiondiv").innerHTML = ""; // Clear previous content

  for (var j = 0; j < questions.length; j++) {
    var questionObj = questions[j];
    var ques = questionObj.question;
    var userAns = Ansgiven[j];
    var correctAns = questionObj.answer;
    var num = j + 1;
    
    questionContent += "Q." + num + " " + ques + "<br>";
    
    // Display answers based on question type
    if (questionObj.options) {
      // Multiple-choice question
      var correctAnswerText = questionObj.options[correctAns].image ? 
        "<img src='" + questionObj.options[correctAns].image + "' alt='Correct Answer Image' style='width:100px;height:auto;'/>" : 
        questionObj.options[correctAns].text;
      
      var givenAnswerText = userAns !== undefined && userAns !== null ? 
        (questionObj.options[userAns].image ? 
          "<img src='" + questionObj.options[userAns].image + "' alt='Given Answer Image' style='width:100px;height:auto;'/>" : 
          questionObj.options[userAns].text) : 
        "Not Answered";
      
      // Mark incorrect answers
      var isCorrect = userAns === correctAns;
      if (!isCorrect) {
        givenAnswerText = "<span style='color: red;'>" + givenAnswerText + "</span>";
      }
      
      questionContent += "Correct Answer: " + correctAnswerText + "<br>" + 
                         "Answer Given: " + givenAnswerText + "<br><br>";
    } 
    else if (questionObj.inputBox) {
      // Input box question (including area model)
      questionContent += "Correct Answer(s): ";
      
      // Display all correct answers
      if (Array.isArray(correctAns)) {
        questionContent += correctAns.join(", ");
      } else {
        questionContent += correctAns;
      }
      
      questionContent += "<br>Answer Given: ";
      
      // Display user answers
      if (Array.isArray(userAns) && userAns.length > 0) {
        let formattedAnswers = [];
        
        for (let k = 0; k < userAns.length; k++) {
          const userValue = userAns[k] || "__";
          const correctValue = Array.isArray(correctAns) && k < correctAns.length ? correctAns[k] : null;
          
          // Mark incorrect answers in red
          if (correctValue && String(userValue).trim() !== String(correctValue).trim()) {
            formattedAnswers.push("<span style='color: red;'>" + userValue + "</span>");
          } else {
            formattedAnswers.push(userValue);
          }
        }
        
        questionContent += formattedAnswers.join(", ");
      } else {
        questionContent += "<span style='color: red;'>Not Answered</span>";
      }
      
      questionContent += "<br><br>";
    }
  }

  // Store the question content in local storage with a unique key
  saveToLocalStorage(topicName + '_question_content', questionContent);

  // Display results
  document.getElementById("picdiv").innerHTML = content;
  document.getElementById("questiondiv").innerHTML = questionContent + home;
}

function checkAnswer() {
  submitSound.play();

  // Save the answer for the current question
  saveCurrentAnswer();
  
  // Hide submit button and show next button
  document.getElementById("subbtn").style.display = "none";
  document.getElementById("nextbtn").style.display = "inline-block";

  // Update the button styles to mark this question as answered
  updateButtonStyles();
}


function abc(x) {
  // Save the current answer before changing questions
  saveCurrentAnswer();
  i = x - 1;
  loadQuestion(i);
  document.getElementById("result").innerHTML = "";
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";

  // Update button styles and visibility
  highlightButton(i);
  updateButtonStyles();
}


function updateButtonVisibility() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  var textAreaAnswer = document.getElementById("answerTextArea");
  
  if (selectedAnswer || (textAreaAnswer && textAreaAnswer.value.trim() !== "")) {
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
  } else {
    document.getElementById("subbtn").style.display = "none";
    document.getElementById("nextbtn").style.display = "inline-block";
  }
}

function highlightButton(index) {
  var buttonContainer = document.getElementById("buttonContainer");
  var buttons = buttonContainer.getElementsByTagName("button");

  // Remove highlight from all buttons
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("highlighted-btn");
  }

  // Add highlight to the current button
  if (index >= 0 && index < buttons.length) {
    buttons[index].classList.add("highlighted-btn");
  }
}

function updateButtonStyles() {
  var buttonContainer = document.getElementById("buttonContainer");
  var buttons = buttonContainer.getElementsByTagName("button");

  // Remove "answered-btn" class from all buttons
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("answered-btn");
  }

  // Add "answered-btn" class for answered questions
  Ansgiven.forEach((answer, index) => {
    if (answer !== null && answer !== undefined) {
      // For array answers (input boxes), check if at least one input has a value
      if (Array.isArray(answer)) {
        const hasAnswer = answer.some(value => value && value.trim() !== '');
        if (hasAnswer && index < buttons.length) {
          buttons[index].classList.add("answered-btn");
        }
      } 
      // For multiple choice answers
      else if (index < buttons.length) {
        buttons[index].classList.add("answered-btn");
      }
    }
  });
}


function updateButtonText() {
  var nextButton = document.getElementById("nextbtn");
  if (i === count - 1) {
    nextButton.innerHTML = "FINISH TEST";
    nextButton.onclick = function() {
      newques(); // Calls newques which will hide buttonContainer
    };
  } else {
    nextButton.innerHTML = "Next";
   
  }
}


