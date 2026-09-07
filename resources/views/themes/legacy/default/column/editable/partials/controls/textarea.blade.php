<textarea class="soa-inline-editor-control"
          id="{{ $editorControlId }}"
          name="{{ $name }}"
          rows="{{ $rows ?? 10 }}"
          @if($required ?? false) required @endif
          data-inline-editor-control>{{ $value }}</textarea>
