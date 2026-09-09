<input class="soa-inline-editor-control soa-input"
       data-inline-editor-control
       id="{{ $editorControlId }}"
       name="{{ $name }}"
       @if($required ?? false) required @endif
       type="text"
       value="{{ $value }}">
