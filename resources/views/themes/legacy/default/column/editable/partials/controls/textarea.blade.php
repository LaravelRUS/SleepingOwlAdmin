<textarea class="soa-inline-editor-control"
          id="{{ $editorControlId }}"
          name="{{ $name }}"
          @if($required ?? false) required @endif
          data-inline-editor-control>{{ $value }}</textarea>
