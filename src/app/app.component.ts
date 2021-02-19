import { Component } from "@angular/core";
import { EditorChangeContent, EditorChangeSelection } from "ngx-quill";
import "quill-mention";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const atValues = [
  { id: "{{ user.a }}", value: "Todos los alumnos", blotHTML: `<span class="mention" data-index="0" data-denotation-char="@" data-id="{{ user.a }}" data-value="Todos los alumnos"><span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Todos los alumnos</span></span>` },
  { id: "{{ Determinado alumno 1 }}", value: "Determinado alumno 1", blotHTML: `<span class="mention" data-index="1" data-denotation-char="@" data-id="{{ Determinado alumno 1 }}" data-value="Determinado alumno 1"><span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Determinado alumno 1</span></span>` },
  { id: "{{ Determinado alumno 2 }}", value: "Determinado alumno 2", blotHTML: `<span class="mention" data-index="2" data-denotation-char="@" data-id="{{ Determinado alumno 2 }}" data-value="Determinado alumno 2"><span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Determinado alumno 2</span></span>` },
  { id: "{{ Determinado alumno 3 }}", value: "Determinado alumno 3", blotHTML: `<span class="mention" data-index="3" data-denotation-char="@" data-id="{{ Determinado alumno 3 }}" data-value="Determinado alumno 3"><span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Determinado alumno 3</span></span>` }
];

const hashValues = [
  { id: "{{ Valor hash 1 }}", value: "Valor hash 1" },
  { id: "{{ Valor hash 2 }}", value: "Valor hash 2" },
];

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Prueba Quill";
  bodyToSave = null;
  subjectToSave = null;
  content = null;
  opsSubject = null;
  opsBody = null;

  public quillBodyConfig = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "emoji"],
      ],
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: function (searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = atValues;
        } else {
          values = hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
  }

  public quillSubjectConfig = {
    toolbar: false,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@", "#"],
      source: function (searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = atValues;
        } else {
          values = hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
  }

  changedEditorBody(event: EditorChangeContent | EditorChangeSelection) {
    const contents = event.editor.getContents();
    this.opsBody = contents;
  }

  changedEditorSubject(event: EditorChangeContent | EditorChangeSelection) {
    const contents = event.editor.getContents();
    this.opsSubject = contents;
  }

  convert() {
    let cfg = {};
    let html

    let converterBody = new QuillDeltaToHtmlConverter(this.opsBody.ops, cfg);
    converterBody.renderCustomWith((customOp) => {
      if (customOp.insert.type === "mention") {
        const mention = customOp.insert.value;
        return `${mention.id}`;
      }
    });
    html = converterBody.convert();
    this.bodyToSave = html;

    let converterSubject = new QuillDeltaToHtmlConverter(this.opsSubject.ops, cfg);
    converterSubject.renderCustomWith((customOp) => {
      if (customOp.insert.type === "mention") {
        const mention = customOp.insert.value;
        return `${mention.id}`;
      }
    });
    html = converterSubject.convert();
    this.subjectToSave = html;
    // console.log(this.bodyToSave);
    // console.log(this.subjectToSave);
    
  }

  boton() {
    let stringBody = this.bodyToSave
    let stringsubject = this.subjectToSave

    atValues.forEach((valor) => stringBody = stringBody.replace(RegExp(valor.id, "g"), valor.blotHTML))
    stringBody = stringBody.replace(RegExp('<br/>', "g"), '</p><p>')
    document.getElementById("body2").children[1].children[0].innerHTML = stringBody

    atValues.forEach((valor) => stringsubject = stringsubject.replace(RegExp(valor.id, "g"), valor.blotHTML))
    stringsubject = stringsubject.replace(RegExp('<br/>', "g"), '</p><p>')
    console.log(document.getElementById("subject2"));
    console.log(document.getElementById("body2"));
    
    document.getElementById("subject2").children[0].children[0].innerHTML = stringsubject
  }
}