<input class="soa-inline-editor-control soa-input"
       data-inline-editor-control
       data-date-control="datetime"
       data-date-format="{{ $editorDateFormat }}"
       id="{{ $editorControlId }}"
       name="{{ $name }}"
       @if($required ?? false) required @endif
       type="text"
       value="{{ $value }}">
