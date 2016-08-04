<?php
namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Translation\TranslatorInterface;

class FileElementController extends Controller
{
    /**
     * @var array
     */
    protected $config = [
        'file' => [
            'rules' => [
                'file' => 'required',
            ],
            'configPathKey' => 'sleeping_owl.filesUploadDirectory',
            'path' => 'files/uploads',
        ],
        'image' => [
            'rules' => [
                'file' => 'required|image',
            ],
            'callback' => 'imageCallback',
            'configPathKey' => 'sleeping_owl.imagesUploadDirectory',
            'path' => 'images/uploads',
        ],
    ];

    /**
     * @param Request $request
     * @param Factory $factory
     * @param Container $container
     * @param ResponseFactory $responseFactory
     * @param Repository $config
     * @param $type
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function file(Request $request,
                         Factory $factory,
                         Container $container,
                         ResponseFactory $responseFactory,
                         Repository $config,
                         $type)
    {
        if (! array_key_exists($type, $this->config)) {
            throw new NotFoundHttpException();
        }

        $validationRules = Arr::get($this->config, $type.'rules', []);
        $validator = $factory->make($request->all(), $validationRules);

        if (method_exists($this, $method = Arr::get($this->config, $type.'.callback'))) {
            $container->call([$this, $method], ['validator' => $validator]);
        }

        if ($validator->fails()) {
            return $responseFactory->make($validator->errors()->get('file'), 400);
        }

        $file = $request->file('file');
        $filename = md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
        $path = $config->get(Arr::get($this->config, $type.'.configPathKey'), Arr::get($this->config, $type.'.path'));
        $fullPath = public_path($path);
        $file->move($fullPath, $filename);

        $value = $path.'/'.$filename;

        return $responseFactory->json([
            'url' => asset($value),
            'value' => $value,
        ]);
    }

    /**
     * @param Validator $validator
     * @param TranslatorInterface $translator
     */
    public function imageCallback(Validator $validator, TranslatorInterface $translator)
    {
        $validator->after(function ($validator) use ($translator) {
            /** @var UploadedFile $file */
            $file = Arr::get($validator->attributes(), 'file');

            $size = getimagesize($file->getRealPath());

            if (! $size) {
                $validator->errors()->add('file', $translator->trans('sleeping_owl::validation.not_image'));
            }
        });
    }
}