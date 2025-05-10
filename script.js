"use strict";

// Wait for the DOM to be fully loaded
$(document).ready(function () {
    // Retrieve and apply the saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Get the ID of the current page to determine which functionality to initialize
    const pageId = $("body").attr("id");

    // Initialize specific functionality based on the page ID
    if (pageId === "study-tracker" || pageId === "index") {
        console.log("Study Tracker page loaded.");
        loadQuotes(); // Load quotes for the study tracker page
    }

    if (pageId === "study-timer") {
        console.log("Study Timer page loaded.");
        initializeStudyTimer(); // Initialize the study timer
    }

    if (pageId === "task-manager") {
        console.log("Task Manager page loaded.");
        initializeTaskManager(); // Initialize the task manager
    }

    if (pageId === "notes") {
        console.log("Notes page loaded.");
        initializeNotes(); // Initialize the notes feature
    }

    if (pageId === "dashboard") {
        console.log("Dashboard page loaded.");
        initializeDashboard(); // Initialize the dashboard
    }

    if (pageId === "settings") {
        console.log("Settings page loaded.");
        initializeSettings(); // Initialize the settings page
    }

    if (pageId === "support") {
        console.log("Support page loaded.");
        initializeSupportForm(); // Initialize the support form
    }
});

// Function to load quotes from the JSON file
function loadQuotes() {
    $.ajax({
        url : "quotes.json",
        dataType: "json",
        success: function (data) {
            let quotes = "<ul>";
            data.forEach(function (quote) {
                quotes += `<li>${quote.text} - <em>${quote.author}</em></li>`;
            });
            quotes += "</ul>";
            $("#quotes-container").html(quotes);
        },
        error: function () {
            toastr.error("Failed to load quotes.");
        }
    });
}
// Function to initialize the settings page
function initializeSettings() {
    console.log("Initializing Settings...");

    // Retrieve saved settings from localStorage or use defaults
    const savedTheme = localStorage.getItem("theme") || "light";
    const notificationEnabled = JSON.parse(localStorage.getItem("notificationEnabled")) ?? true;
    const savedFontSize = localStorage.getItem("fontSize") || "medium";

    // Populate the settings form with saved values
    $("#theme-select").val(savedTheme);
    $("#notification-enabled").prop("checked", notificationEnabled);
    $("#font-size").val(savedFontSize);

    // Apply the saved theme and font size
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);

    // Save settings when the save button is clicked
    $("#save-settings").on("click", function (e) {
        e.preventDefault();

        // Get new settings from the form
        const newTheme = $("#theme-select").val();
        const newNotificationEnabled = $("#notification-enabled").prop("checked");
        const newFontSize = $("#font-size").val();

        // Save new settings to localStorage
        localStorage.setItem("theme", newTheme);
        localStorage.setItem("notificationEnabled", newNotificationEnabled);
        localStorage.setItem("fontSize", newFontSize);

        // Apply the new settings
        applyTheme(newTheme);
        applyFontSize(newFontSize);

        // Show a success message
        toastr.success("Settings saved successfully!");
    });

    // Reset settings to defaults when the reset button is clicked
    $("#reset-settings").on("click", function () {
        localStorage.removeItem("theme");
        localStorage.removeItem("notificationEnabled");
        localStorage.removeItem("fontSize");

        location.reload(); // Reload the page to apply default settings
    });
}

// Function to apply the selected theme
function applyTheme(theme) {
    if (theme === "dark") {
        $("body").addClass("dark-theme").removeClass("light-theme");
        $("#jquery-ui-css").attr("href", "https://code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css");
    } else {
        $("body").addClass("light-theme").removeClass("dark-theme");
        $("#jquery-ui-css").attr("href", "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    }
}

// Function to apply the selected font size
function applyFontSize(size) {
    $("body").removeClass("small-font medium-font large-font");

    if (size === "small") {
        $("body").addClass("small-font");
    } else if (size === "large") {
        $("body").addClass("large-font");
    } else {
        $("body").addClass("medium-font");
    }
}

// Function to initialize the support form with validation
function initializeSupportForm() {
    console.log("Initializing support form validation...");
    $("#support-form").validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            message: "required"
        },
        messages: {
            name: "Please enter your name.",
            email: "Please enter a valid email address.",
            message: "Please enter your message."
        },
        submitHandler: function (form) {
            $(form)[0].reset(); // Clear form fields
        
            $("#form-alert")
                .hide() // ensure clean fade
                .text("Thank you for your message! We will get back to you soon.")
                .fadeIn();
        
            setTimeout(() => {
                $("#form-alert").fadeOut();
            }, 5000);
        }
    });
}

// Function to initialize the notes feature
function initializeNotes() {
    console.log("Initializing Notes...");
    const noteCollection = JSON.parse(localStorage.getItem("notes")) || [];

    // Function to render the list of notes
    function renderNotes() {
        $("#notes-list").empty();
        noteCollection.forEach((note, index) => {
            $("#notes-list").append(
                `<li>${note} <button class="delete-note" data-index="${index}">Delete</button></li>`
            );
        });
    }

    // Save a new note when the save button is clicked
    $("#save-note").click(function () {
        const note = $("#note-input").val().trim();
        if (note) {
            noteCollection.push(note);
            localStorage.setItem("notes", JSON.stringify(noteCollection));
            renderNotes();
            $("#note-input").val(""); // Clear the input field
        } else {
            toastr.warning("Please enter a note.");
        }
    });

    // Delete a note when the delete button is clicked
    $("#notes-list").on("click", ".delete-note", function () {
        const index = $(this).data("index");
        noteCollection.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(noteCollection));
        renderNotes();
    });

    renderNotes(); // Render notes on page load
}

// Function to initialize the dashboard
function initializeDashboard() {
    console.log("Initializing Dashboard...");
    
    // Retrieve data from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const sessionsCompleted = parseInt(localStorage.getItem("sessionsCompleted")) || 0;

    // Display dashboard statistics
    $("#dashboard-tasks").html(`
        <div class="dashboard-card">
            <h3>Total Tasks</h3>
            <p>${tasks.length}</p>
        </div>
        <div class="dashboard-card">
            <h3>Saved Notes</h3>
            <p>${notes.length}</p>
        </div>
        <div class="dashboard-card">
            <h3>Study Sessions Completed</h3>
            <p>${sessionsCompleted}</p>
        </div>
    `);
}

// Function to initialize the task manager
function initializeTaskManager() {
    console.log("Initializing Task Manager...");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Function to render the list of tasks
    function renderTasks() {
        $("#task-list").empty();
        tasks.forEach((task, index) => {
            $("#task-list").append(
                `<li>${task} <button class="delete-task" data-index="${index}">Delete</button></li>`
            );
        });
    }

    // Initialize the date picker for due dates
    $("#due-date").datepicker();

    // Add a new task when the add button is clicked
    $("#add-task").click(function () {
        const task = $("#task-input").val().trim();
        const dueDate = $("#due-date").val().trim();

        if (task) {
            let taskEntry = dueDate ? `${task} (Due: ${dueDate})` : `${task} (Due: N/A)`;

            tasks.push(taskEntry);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            $("#task-input").val(""); // Clear the input field
            $("#due-date").val(""); // Clear the date picker
        } else {
            toastr.warning("Please enter a task.");
        }
    });

    // Delete a task when the delete button is clicked
    $("#task-list").on("click", ".delete-task", function () {
        const index = $(this).data("index");
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    });

    renderTasks(); // Render tasks on page load
}

// Function to initialize the study timer
function initializeStudyTimer() {
    let timerDuration = 25 * 60; // 25 minutes
    let remainingTime = timerDuration;
    let timer;
    let isRunning = false;
    let sessionsCompleted = parseInt(localStorage.getItem("sessionsCompleted")) || 0;

    // Function to update the timer display
    function updateDisplay() {
        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        const seconds = (remainingTime % 60).toString().padStart(2, '0');
        $("#timer").text(`${minutes}:${seconds}`);
    }

    // Start the timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (remainingTime > 0) {
                    remainingTime--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    toastr.success("Session complete! Take a break!");
                    sessionsCompleted++;
                    localStorage.setItem("sessionsCompleted", sessionsCompleted);
                    $("#session-count").text(`Sessions Completed: ${sessionsCompleted}`);
                    remainingTime = timerDuration;
                    updateDisplay();
                }
            }, 1000);
        }
    }

    // Pause the timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        remainingTime = timerDuration;
        isRunning = false;
        updateDisplay();
    }

    // Attach event handlers to timer buttons
    $("#start").click(startTimer);
    $("#pause").click(pauseTimer);
    $("#reset").click(resetTimer);

    updateDisplay(); // Initialize the timer display
}