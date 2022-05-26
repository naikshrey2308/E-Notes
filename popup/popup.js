window.addEventListener("load", () => {
    // Loading Screen
    function slideUp() {
        document.getElementById("intro-div").style.display = "none";
        document.getElementById("main").style.display = "initial";
        document.body.classList.add("p-3");
    }
    setTimeout(slideUp, 750);


    let currnote = document.URL.substring(document.URL.indexOf("notebook="));
    currnote = currnote.replace("notebook=", "");
    if(document.URL.indexOf("notebook=") == -1)
        currnote = "[]";
    else
        currnote = decodeURIComponent(currnote);

    for (let [key, value] of Object.entries(localStorage)) {
        createNotebook(key.toString().replace("ENOTES_notes_", ""));
    }
        
    for(let x of document.getElementsByClassName("nav-link")) {
        if(x.textContent == currnote)
            x.classList.add("active");
    }
        
    let bgList = ["bg-success", "bg-warning", "bg-light", "bg-dark", "bg-info", "bg-primary"];
    bgListitr = 0;
    currbgBack = "bg-primary";
    let totalNotes = 0;
    
    // localStorage.clear();
    let newNotes = (localStorage.getItem("ENOTES_notes_" + currnote) == null || localStorage.getItem("ENOTES_notes_" + currnote) == "") ? [] : JSON.parse(localStorage.getItem("ENOTES_notes_" + currnote)), notes=[];   
    for(let i in newNotes)
        if(newNotes[i] !== null)
            notes.push(newNotes[i]);
    if(currnote != "[]")
        localStorage.setItem("ENOTES_notes_" + currnote, JSON.stringify(notes));
    for(let i in  notes) {
        addNote(totalNotes, notes[i].heading, notes[i].body, notes[i].color);
        totalNotes++;
    }
    
    document.getElementById("no-notes").style.display = (totalNotes == 0) ? "block" : "none";
    // if(totalNotes == 0)
    //     document.getElementById("notebookDeletor").style.display = "none";

    function addNote(id, header, value, color) {
        let note = document.createElement("div");
        if(color == "")
        color = currbgBack;
        note.classList.add("note", color, "bg-opacity-25", "p-3", "border");
        note.id = id;
        
        let noteHeader = document.createElement("div");
        noteHeader.classList.add("note-header");
        
        let noteBtns = document.createElement("div");
        noteBtns.classList.add("d-flex", "btn-functions");
        
        let noteViewBtn = document.createElement("button");
        noteViewBtn.classList.add("btn", "d-block", "my-auto", "p-1", "viewBtn");
        noteViewBtn.innerHTML = `<img src="../images/eye-fill.svg">`;
        noteViewBtn.onclick = function() { 
            noteBody.classList.toggle("d-none");
            this.innerHTML = (this.innerHTML == `<img src="../images/eye-fill.svg">`) ? `<img src="../images/eye-slash-fill.svg">` : `<img src="../images/eye-fill.svg">`;
        };
        
        let noteEditBtn = document.createElement("button");
        noteEditBtn.classList.add("btn", "d-block", "my-auto", "p-1", "editBtn");
        noteEditBtn.innerHTML = `<img src="../images/pen.svg">`;
        noteEditBtn.onclick = function() {
            document.getElementById("add-note-btn").classList.add("d-none");
            document.getElementById("add-note-details").style.display = "initial";
            document.getElementById("add-note-heading").value = noteTitle.textContent;
            document.getElementById("bodyContent").innerHTML = noteBody.innerHTML;
            
            let editedBtn = document.getElementById("add-note-edited-btn");
            editedBtn.classList.remove("d-none");
            editedBtn.onclick = function() {
                let heading = document.getElementById("add-note-heading").value;
                let bodyCon = document.getElementById("bodyContent").innerHTML;
                notes[id].heading = heading;
                notes[id].body = bodyCon;
                localStorage.setItem("ENOTES_notes_" + currnote, JSON.stringify(notes));
                document.getElementById("add-note-btn").classList.remove("d-none");
                document.getElementById("add-note-details").style.display = "none";
                this.classList.add("d-none");
                reload("popup.html?notebook=" + currnote);
            }        
        }

        let noteCloseBtn = document.createElement("button");
        noteCloseBtn.classList.add("btn", "d-block", "my-auto", "p-1", "btn-close");
        noteCloseBtn.onclick = function() {
            delete notes[id];
            localStorage.setItem("ENOTES_notes_" + currnote, JSON.stringify(notes));
            let parent = this.parentElement.parentElement.parentElement;
            parent.style.transistion = "all ease-in-out 0.5s";
            parent.style.animation = "0.2s ease slideLeft";
            setTimeout(() => { parent.remove(); }, 200);
        };

        noteBtns.appendChild(noteViewBtn);
        noteBtns.appendChild(noteEditBtn);
        noteBtns.appendChild(noteCloseBtn);

        let noteTitle = document.createElement("h6");
        noteTitle.classList.add("d-block", "my-auto");
        noteTitle.textContent = header;

        let noteBody = document.createElement("div");
        noteBody.classList.add("d-none", "note-body");
        noteBody.innerHTML = value;

        noteHeader.appendChild(noteTitle);
        noteHeader.appendChild(noteBtns);
        note.appendChild(noteHeader);
        note.appendChild(noteBody);
        note.oncontextmenu = function(e){
            e.preventDefault();

            let tempColor = (bgList.indexOf(note.classList[1]) <= bgList.length - 1) ? (bgList.indexOf(note.classList[1])) + 1 : 0;
            note.classList.replace(note.classList[1], bgList[tempColor]);
            bgListitr = (bgListitr >= bgList.length - 1) ? 0 : (bgListitr + 1);
            notes[id].color = bgList[tempColor];
            localStorage.setItem("ENOTES_notes_" + currnote, JSON.stringify(notes));
        };

        document.getElementsByClassName("note-container")[0].appendChild(note);
        return note;
    }

    document.getElementById("add-note-btn").onclick = function() {
        this.classList.toggle("d-none");
        document.getElementById("add-note-done-btn").classList.toggle("d-none");
        let noteInfo = document.getElementById("add-note-details");
        noteInfo.style.display = "initial";
    }

    document.getElementById("add-note-done-btn").onclick = function() {
        let noteInfo = document.querySelector("#add-note-details > #bodyContent");
        if(noteInfo.innerHTML == "")
            return;

        let noteHeading = document.getElementById("add-note-heading");
        if(noteHeading.value == "")
            noteHeading.value = new Date().toString();

        this.classList.toggle("d-none");
        document.getElementById("add-note-btn").classList.toggle("d-none");
        let newNote = addNote(totalNotes, noteHeading.value, noteInfo.innerHTML, "bg-primary");
        totalNotes ++;
        if(totalNotes == 1)
            document.getElementById("no-notes").style.display = "none";

        notes.push({ heading: noteHeading.value, body: noteInfo.innerHTML, color: newNote.classList[1] });
        localStorage.setItem("ENOTES_notes_" + currnote, JSON.stringify(notes));

        let noteDetails = document.getElementById("add-note-details");
        noteDetails.style.display = "none";
    }

    let commands = ["boldBtn", "italicBtn", "underlineBtn", "strikeThroughBtn", "backColorBtn", "foreColorBtn"];
    let defColor = { font: "red", highlight: "yellow" };
    for(let x of commands) {
        document.getElementById(x).addEventListener("click", function() {
            if(x == "backColorBtn")
                document.execCommand(x.replace("Btn", ""), false, defColor.highlight);
            else if(x == "foreColorBtn")
                document.execCommand(x.replace("Btn", ""), false, defColor.font);
            else
                document.execCommand(x.replace("Btn", ""));
        });
    }

    document.getElementById("fColorSelect").onclick = function() {
        document.getElementById("f-colors").classList.toggle("d-none");
        if(!document.getElementById("h-colors").classList.contains("d-none"))
            document.getElementById("h-colors").classList.toggle("d-none");
    }
    document.getElementById("hColorSelect").onclick = function() {
        document.getElementById("h-colors").classList.toggle("d-none");
        if(!document.getElementById("f-colors").classList.contains("d-none"))
            document.getElementById("f-colors").classList.toggle("d-none");
    }
    document.getElementById("f-colors").onclick = function(e) {
        if(e.target.classList.contains("colorDot")) {
            defColor.font = e.target.style.backgroundColor;
            document.getElementById("foreColorBtn").style.color = defColor.font;
        }
    }
    document.getElementById("h-colors").onclick = function(e) {
        if(e.target.classList.contains("hcolorDot")) {
            defColor.highlight = e.target.style.backgroundColor;
            document.getElementById("backColorBtn").style.backgroundColor = defColor.highlight;
        }
    }

    document.getElementById("notebookCreator").addEventListener("click", function() {
        document.getElementById("newNoteBookName").classList.toggle("d-none");
        if(!document.getElementById("newNoteBookName").classList.contains("d-none")) {
            return;
        }
        
        let name = document.getElementById("newNoteBookName").value;
        name = (name === "") ? "Untitled" : name; 
        createNotebook(name);
        localStorage.setItem("ENOTES_notes_" + name, "[]");

        if(document.getElementsByClassName("nav-link").length == 1) {
            reload("popup.html?notebook=" + encodeURIComponent(name));
        }
    });

    function createNotebook(name) {
        for(let x of document.getElementsByClassName("nav-link")) {
            if(x.textContent == name) {
                alert("Notebook already exists");
                return;
            }
        }
        
        let notebook = document.createElement("li");
        notebook.classList.add("nav-item", "d-inline-block");
        let notelink = document.createElement("a");
        notelink.classList.add("nav-link");
        notelink.textContent = name;
        notebook.appendChild(notelink);
        document.getElementById("notebook-container").appendChild(notebook);
        notelink.setAttribute("href", "popup.html?notebook=" + encodeURIComponent(name));
    }

    document.getElementById("notebookDeletor").addEventListener("click", function() {
        let r = confirm("Are you sure?");
        if(!r)
            return;
        
        let notebooks = document.getElementsByClassName("nav-link");
        for(let x of notebooks) {
            if(x.classList.contains("active")) {
                x.remove();
                localStorage.removeItem("ENOTES_notes_" + x.textContent);
                break;
            }
        }
        if(notebooks.length == 0) {
            reload("popup.html");
        }
    });

    function reload(url) {
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.click();
    }
});