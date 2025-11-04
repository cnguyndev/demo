<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductStoreController;
use App\Http\Controllers\ProductSaleController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductAttributeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\SocialIconController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MomoController;
use App\Http\Controllers\SepayWebhookController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VerifyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::apiResource('banner', BannerController::class);

Route::get('getNewProduct', [ProductController::class, 'getNewProduct']);
Route::get('getSaleProduct', [ProductController::class, 'getSaleProduct']);
Route::get('getHotProduct', [ProductController::class, 'getHotProduct']);
Route::get('checkStore', [ProductController::class, 'checkStore']);
Route::get('getProductByCategory/{id}', [ProductController::class, 'getProductByCategory']);
Route::get('getAllProduct', [ProductController::class, 'getAllProduct']);
Route::get('getLastestProduct', [ProductController::class, 'getLastestProduct']);
Route::get('getAllProduct', [ProductController::class, 'getAllProduct']);
Route::get('getListProduct', [ProductController::class, 'getListProduct']);
Route::get('getExistStore/{id}', [ProductController::class, 'getExistStore']);
Route::get('getProductCategory/{slug}', [ProductController::class, 'getProductCategory']);
Route::get('getProductSearch/{query}', [ProductController::class, 'getProductSearch']);

Route::apiResource('product', ProductController::class);

Route::apiResource('product-store', ProductStoreController::class);
Route::apiResource('product-sale', ProductSaleController::class);
Route::apiResource('product-image', ProductImageController::class);
Route::apiResource('product-attribute', ProductAttributeController::class);

Route::get('getChildren', [CategoryController::class, 'getChildren']);
Route::get('getCategories', [CategoryController::class, 'getCategories']);
Route::get('getParent', [CategoryController::class, 'getParent']);
Route::apiResource('category', CategoryController::class);

Route::apiResource('attribute', AttributeController::class);
Route::apiResource('topic', TopicController::class);

Route::get('getNewPost', [PostController::class, 'getNewPost']);
Route::get('getPostByTopic/{id}', [PostController::class, 'getPostByTopic']);
Route::get('getAllPost', [PostController::class, 'getAllPost']);
Route::get('getPostbyId/{id}', [PostController::class, 'getPostbyId']);
Route::apiResource('post', PostController::class);

Route::put('updateStatusOrder/{id}', [OrderController::class, 'updateStatusOrder']);
Route::apiResource('order', OrderController::class);
Route::apiResource('order-detail', OrderDetailController::class);
Route::apiResource('setting', SettingController::class);

Route::get('getReply/{id}', [ContactController::class, 'getReply']);
Route::put('updateStatusContact/{id}', [ContactController::class, 'updateStatusContact']);
Route::post('replyContact', [ContactController::class, 'replyContact']);

Route::apiResource('contact', ContactController::class);
Route::apiResource('menu', MenuController::class);

Route::put('updatePassword', [UserController::class, 'updatePassword']);
Route::put('changePassword', [UserController::class, 'changePassword']);
Route::apiResource('user', UserController::class);

Route::apiResource('social', SocialController::class);
Route::apiResource('social-icon', SocialIconController::class);


//Admin
Route::get('getAdminProduct', [AdminController::class, 'getAdminProduct']);
Route::get('getAdminTopic', [AdminController::class, 'getAdminTopic']);
Route::get('getAdminBanner', [AdminController::class, 'getAdminBanner']);
Route::get('getAdminCategory', [AdminController::class, 'getAdminCategory']);
Route::get('getAdminPost', [AdminController::class, 'getAdminPost']);
Route::get('getAdminContact', [AdminController::class, 'getAdminContact']);
Route::get('getAdminOrder', [AdminController::class, 'getAdminOrder']);
Route::get('getAdminProductSale', [AdminController::class, 'getAdminProductSale']);
Route::get('getAdminProductDetail/{id}', [AdminController::class, 'getAdminProductDetail']);
Route::get('getAdminProductStore', [AdminController::class, 'getAdminProductStore']);
Route::get('getAdminSocial', [AdminController::class, 'getAdminSocial']);
Route::get('getAdminAttribute', [AdminController::class, 'getAdminAttribute']);
Route::get('getAdminSocialIcon', [AdminController::class, 'getAdminSocialIcon']);
Route::get('getAdminUser', [AdminController::class, 'getAdminUser']);

//Auth
Route::post('adminLogin', [AuthController::class, 'adminLogin']);
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('verifyUser', [AuthController::class, 'verifyUser']);
Route::get('verifyAdmin', [AuthController::class, 'verifyAdmin']);
Route::post('/auth/resend-verification', [AuthController::class, 'resendVerification']);
Route::get('/verify-email/{id}', [VerifyController::class, 'verify'])->name('verify.email');
//Upload
Route::post('/upload',  [UploadController::class, 'uploadSingle']);   // 1 file: field 'image'
Route::post('/uploads', [UploadController::class, 'uploadMultiple']); // nhiều file: field 'images[]'
Route::delete('/upload', [UploadController::class, 'deleteFile']);

Route::prefix('payments/momo')->group(function () {
    Route::post('create', [MomoController::class, 'create']);
    Route::post('ipn', [MomoController::class, 'ipn']);
});

Route::post('/webhook/sepay-handler', [SepayWebhookController::class, 'handle']);
