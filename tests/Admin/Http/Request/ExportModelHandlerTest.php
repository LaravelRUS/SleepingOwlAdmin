<?php

use Mockery as m;
use SleepingOwl\Admin\Http\Request\ExportModel;
use SleepingOwl\Admin\Http\Request\ExportModelHandler;
use SleepingOwl\Admin\Model\SectionModelConfiguration;

class ExportModelHandlerTest extends TestCase
{
    const COLLECTION = [
        ['field1' => 'test1', 'field2' => 'test2'],
    ];

    const COLUMNS = [
        'field1' => 'Test1',
        'field2' => 'Test2',
    ];

    public function tearDown()
    {
        m::close();
    }

    /**
     * @return SectionModelConfiguration
     */
    protected function getSection()
    {
        $section = new TestTableSection($this->app);
        $section->setCollection(
            $this->transformCollectionToModel(self::COLLECTION)
        );
        $section->setColumns($this->getColumns());

        return $section;
    }

    /**
     * @return array
     */
    protected function getColumns()
    {
        return array_map(function ($fieldName, $label) {
            return \AdminColumn::text($fieldName, $label);
        },
            array_keys(self::COLUMNS),
            self::COLUMNS
        );
    }

    /**
     * Transform array of array to array of Models.
     * @param array $collection
     * @return array
     */
    protected function transformCollectionToModel(array $collection)
    {
        $collection = array_map(function ($data) {
            return $this->getModel($data);
        },
            $collection
        );

        return $collection;
    }

    /**
     * @param array $data
     * @return TestEloquentModel
     */
    protected function getModel(array $data = [])
    {
        $testModel = new TestEloquentModel();

        if (count($data)) {
            foreach ($data as $key => $element) {
                $testModel->{$key} = $element;
            }
        }

        return $testModel;
    }

    protected function getExportModel()
    {
        return m::mock(ExportModel::class);
    }

    /**
     * @param SectionModelConfiguration $model
     * @return ExportModelHandler
     */
    protected function getExportModelHandler(SectionModelConfiguration $model)
    {
        $exportModelHandler = new ExportModelHandler();
        $exportModelHandler->initDisplay($model);

        return $exportModelHandler;
    }

    /**
     * @covers ExportModelHandler::handle()
     */
    public function test_get_data()
    {
        $section = $this->getSection();

        $data = $this->getExportModelHandler($section)->getData($section);

        $this->assertCount(2, $data);
        $this->assertEquals(array_values(self::COLUMNS), $data[1]);
        $this->assertEquals(array_map('array_values', self::COLLECTION), array_slice($data, 1));
    }
}

class TestTableSection extends \SleepingOwl\Admin\Section
{
    /** @var \Illuminate\Support\Collection */
    protected $collection;

    /** @var array */
    protected $columns;

    public function __construct(\Illuminate\Contracts\Foundation\Application $app)
    {
        parent::__construct($app, TestEloquentModel::class);
    }

    public function setColumns($columns)
    {
        $this->columns = $columns;
    }

    public function onDisplay()
    {
        $display = new TestDisplayTable();
        $display->setCollection($this->getCollection());
        $display->setColumns($this->columns);

        return $display;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function getCollection()
    {
        return $this->collection;
    }

    /**
     * @param array $collection
     */
    public function setCollection($collection)
    {
        $this->collection = collect($collection);
    }
}

class TestEloquentModel extends \Illuminate\Database\Eloquent\Model
{
}

class TestDisplayTable extends \SleepingOwl\Admin\Display\DisplayTable
{
    /** @var array */
    protected $collection;

    /**
     * @return array
     */
    public function getCollection()
    {
        return $this->collection;
    }

    /**
     * @param \Illuminate\Support\Collection $collection
     */
    public function setCollection($collection)
    {
        $this->collection = $collection;
    }
}
