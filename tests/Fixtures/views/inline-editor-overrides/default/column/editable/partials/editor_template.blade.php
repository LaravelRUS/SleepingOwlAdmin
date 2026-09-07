<template id="{{ $editorTemplateId }}" data-inline-editor-template="{{ $editorType }}">
    <article class="project-editor-shell" data-inline-editor-root>
        <div class="project-editor-nesting">
            <form class="project-editor-form" data-inline-editor-form>
                <section class="project-control-shell">
                    @include(AdminTemplate::getViewPath('column.editable.partials.controls.'.$editorType))
                </section>
                <footer class="project-editor-actions">
                    <button class="project-save" type="submit">Store</button>
                    <span>
                        <button class="project-cancel"
                                data-inline-editor-cancel
                                type="button">Dismiss</button>
                    </span>
                </footer>
                <p class="project-error" data-inline-editor-error hidden></p>
            </form>
        </div>
    </article>
</template>
