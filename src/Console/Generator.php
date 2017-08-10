<?php
/**
 * Laravel IDE Helper Generator.
 *
 * @author    Barry vd. Heuvel <barryvdh@gmail.com>
 * @copyright 2014 Barry vd. Heuvel / Fruitcake Studio (http://www.fruitcakestudio.nl)
 * @license   http://www.opensource.org/licenses/mit-license.php MIT
 * @link      https://github.com/barryvdh/laravel-ide-helper
 */
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
