<?php

namespace SleepingOwl\Admin\Console;

use Illuminate\Support\Collection;
use Barryvdh\LaravelIdeHelper\Alias;
use Barryvdh\LaravelIdeHelper\Generator as IdeHelperGenerator;

class Generator extends IdeHelperGenerator
{
    /**
     * Regroup aliases by namespace of extended classes.
     *
     * @return Collection
     */
    protected function getAliasesByExtendsNamespace()
    {
        $aliases = $this->getValidAliases();

        $aliases = $aliases->filter(function (Alias $item) {
            return ! collect([
                'MessageStack',
                'AdminSection',
                'AdminTemplate',
                'AdminNavigation',
                'AdminColumn',
                'AdminColumnEditable',
                'AdminColumnFilter',
                'AdminDisplayFilter',
                'AdminForm',
                'AdminFormElement',
                'AdminDisplay',
            ])->search($item->getAlias());
        });

        return $aliases->groupBy(function (Alias $alias) {
            return $alias->getExtendsNamespace();
        });
    }
}
