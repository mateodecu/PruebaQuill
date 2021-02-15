import { Component } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import "quill-mention";

const atValues = [
  { id: '{{ user.a }}', value: "Todos los alumnos" },
  { id: '{{ Determinado alumno 1 }}', value: "Determinado alumno 1" },
  { id: '{{ Determinado alumno 2 }}', value: "Determinado alumno 2" },
  { id: '{{ Determinado alumno 3 }}', value: "Determinado alumno 3" }
];
const hashValues = [
  { id: '{{ Valor hash 1 }}', value: "Valor hash 1" },
  { id: '{{ Valor hash 2 }}', value: "Valor hash 2" }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PruebaQuill';

  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'emoji'],
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
      }
    }
  };

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // console.log(event)

    // console.log(event.editor.container.innerText);
  }
}