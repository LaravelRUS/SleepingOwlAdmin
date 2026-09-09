<input class="soa-inline-editor-control"
       data-inline-editor-control
       data-date-control="date"
       data-date-format="{{ $editorDateFormat }}"
       id="{{ $editorControlId }}"
       name="{{ $name }}"
       @if($required ?? false) required @endif
       type="text"
       value="{{ $value }}">
