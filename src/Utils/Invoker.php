<?php
namespace SleepingOwl\Admin\Utils;

/**
 * Provides invoker for call `Closure` injecting parameters.
 *
 * @param callable $handler
 * @param array $args {
 *     Array of initial args.
 *
 *     Example:
 *
 *         (new Invoker(
 *             function ($arg0, $arg1) {
 *                 // $arg0 is 'first value'
 *                 // $arg1 is 'second value'
 *             },
 *             null,
 *             [ 'firt value', 'second value' ],
 *         ))->invoke();
 *
 *         Utils::invokeHandler(
 *             function ($arg0, MyType $obj, Request $admin) {
 *                 // $arg0 is 'first value'
 *                 // the $obj has be passed in $dependencyProvider
 *                 // the $request has be passed by app(Request::class)
 *             },
 *             [ MyType::class => new MyType() ],
 *             [ 'firt value' ],
 *         );
 * }
 * @param array &$dependencyProvider {
 *     Array of default $args values by type.
 *
 *     Example: `[Admin::class => $admin]`
 *
 *     class MyType {
 *     }
 *
 *     Utils::invokeHandler(
 *         function (MyType $obj, Request $request) {
 *             // the $obj has be passed in $dependencyProvider
 *             // the $request has be passed by app(Request::class)
 *         },
 *         [ MyType::class => new MyType() ],
 *     );
 * }
 * @return mixed
 */
class Invoker
{
    protected $handler;
    protected $args;
    protected $dependencyProvider;

    public function __construct($handler, $args = [], array $dependencyProvider = [])
    {
        $this->handler = $handler;
        $this->args = $args;
        $this->dependencyProvider = $dependencyProvider;
    }

    /**
     * Set the parameters dependency provider map by referency.
     *
     * @param array $dependencyProvider The map of `Type` => `object` pair.
     * @see Invoker::setDependencyProvider()
     * @return $this
     */
    public function setDependencyProviderByRef(array &$dependencyProvider)
    {
        $this->dependencyProvider = &$dependencyProvider;

        return $this;
    }

    /**
     * Set the parameters dependency provider map.
     *
     * The maps is a `Type` as key and value is a `Type` object.
     *
     * For set `default` function for provides all types without TypeName inside
     * in the $dependencyProvider, pass `default` key with the function.
     *
     * For default, the 'default' is {@see app} function.
     *
     * Examples:
     * - `[ MyClass::class => new MyObject() ]`
     * - `[ MyClass::class => $obj ]`
     * - with default:
     *      ```[
     *             MyClass::class => $obj,
     *             'default' => function($cls) {
     *                  return app($cls)
     *             }
     *         ]
     *      ```
     *
     * @param array $dependencyProvider The map of `Type` => `object` pair.
     * @return $this
     */
    public function setDependencyProvider(array $dependencyProvider)
    {
        $this->dependencyProvider = $dependencyProvider;

        return $this;
    }

    /**
     * Create new Invoker instance, and pass args and dependency provider by
     * reference.
     *
     * Example:
     *
     * ```php
     * class MyType
     * {
     *     public $id;
     *     public $name;
     *
     *     public function __construct($id, $name)
     *     {
     *         $this->id = $id;
     *         $this->name = $name;
     *     }
     * }
     *
     * $handler2 = function(MyType $obj, Invoker $ivk) {
     *     $obj->id = 2;
     *     return $ivk->bridge(function(MyType $o, Request $request) {
     *         echo $o->id; // 2
     *         echo $o->name; // the name
     *         return 'ok!';
     *     });
     * };
     *
     * $result = Invoker::invokeNow($handler, [ new MyType(1, "the name") ],
     *     [Request::class => $request]);
     * echo $result; // 'ok!';
     * ```
     *
     * @param callable $handler The handler
     * @return Invoker new Invoker instance.
     */
    public function bridge($handler) {
        return self::create($handler)
            ->setArgsByRef($this->args)
            ->setDependencyProviderByRef($this->dependencyProvider);
    }

    /**
     * Get the handler
     *
     * @return callable
     */
    public function getHandler()
    {
        return $this->handler;
    }

    /**
     * Set the Handler
     *
     * @param callable $handler
     * @return Invoker
     */
    public function setHandler($handler)
    {
        $this->handler = $handler;

        return $this;
    }

    /**
     * Get the initial handler args
     *
     * @return array
     */
    public function getArgs()
    {
        return $this->args;
    }

    /**
     * Set initial handler args
     *
     * @param array $args
     * @return Invoker
     */
    public function setArgs(array  $args)
    {
        $this->args = $args;

        return $this;
    }
    /**
     * Set initial handler args by reference
     *
     * @param array $args
     * @return Invoker
     */
    public function setArgsByRef(array &$args)
    {
        $this->args = &$args;

        return $this;
    }

    /**
     * Call handler passing aditionarl args.
     *
     * The handler args has be {@see Invoker::getArgs()} + `$args`.
     * If {@see Invoker::getArgs()} is `["a", "b"]`, and arg `$args` is
     * `[ "c" ]`, the final args of handler will be `["a", "b", "c"]` +
     * dependency resolved arguments if exists.     *
     *
     * Examples:
     *
     * ```php
     * $invoker->invokeArgs([]);
     * // or
     * $invoker->invokeArgs(["c"]);
     * // or
     * $invoker->invokeArgs(["c", "d"]);
     * ```
     *
     * @param array $args The aditional args.
     * @return mixed Result of handler
     */
    public function &invokeArgs(array $args)
    {
        $args = $this->args + $args;
        $rfHandler = new \ReflectionFunction($this->handler);
        $parameters = array_slice($rfHandler->getParameters(), count($args));
        $defaultDP = array_key_exists('default', $this->dependencyProvider) ?
            $this->dependencyProvider['default'] : 'app';

        /** @var \ReflectionParameter $p */
        foreach ($parameters as $p) {
            $pcls = $p->getClass()->getName();

            if ($pcls == __CLASS__) {
                $args[] = $this;
            } else {
                $args[] = array_key_exists($pcls, $this->dependencyProvider) ?
                    $this->dependencyProvider[$pcls] :
                    call_user_func($defaultDP, $pcls);
            }
        };

        $r = $rfHandler->invokeArgs($args);
        return $r;
    }

    /**
     * Call handler passing args list.
     *
     * Examples:
     *
     * ```php
     * $invoker->invoke();
     * // or
     * $invoker->invoke("a");
     * // or
     * $invoker->invoke("a", "b");
     * ```
     *
     * @see Invoker::invokeArgs
     * @return mixed Result of handler
     */
    public function &invoke()
    {
        return $this->invokeArgs(func_get_args());
    }

    /**
     * Create new Invoker inscante of $handler, with $args and
     * $dependencyProvider.
     *
     * @param callable $handler The handler
     * @param array $args The initial args. {@see Invoker::setArgs()}
     * @param array $dependencyProvider The Dependency Provider.
     *                                  {@see Invoker::setDependencyProvider()}
     * @return Invoker object.
     */
    public static function create($handler, $args = [], $dependencyProvider = [])
    {
        return new self($handler, $args, $dependencyProvider);
    }

    /**
     * Create new Invoker instance of $handler, with $args and
     * $dependencyProvider, and invoke it now.
     *
     * @param callable $handler The handler
     * @param array $args The initial args. {@see Invoker::setArgs()}
     * @param array $dependencyProvider The Dependency Provider.
     *                                  {@see Invoker::setDependencyProvider()}
     * @return mixed Result of handler
     */
    public static function &invokeNow($handler, $args = [], $dependencyProvider = [])
    {
        return self::create($handler, $args, $dependencyProvider)->invoke();
    }
}