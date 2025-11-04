<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UploadController extends Controller
{
    public function uploadSingle(Request $request)
    {
        $validated = $request->validate([
            'perfix' => ['required', 'string', 'max:255'],
            'slug'   => ['required', 'string', 'max:255'],
            'image'  => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $slug = Str::slug($validated['slug']);
        $file = $validated['image'];
        $perfix = $validated['perfix']; // ví dụ: 'products', 'categories'

        $timestamp = Carbon::now()->format('Ymd_His');
        $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename = "{$slug}_thumbnail_{$timestamp}.{$ext}";

        // --- ĐÃ SỬA ---
        // Thay vì public_path(), chúng ta dùng base_path() để trỏ đến thư mục gốc của project,
        // sau đó chỉ định rõ vào 'public_html/images/...'
        $uploadPath = base_path("public_html/images/{$perfix}");

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $file->move($uploadPath, $filename);

        // --- ĐÃ SỬA ---
        // Cập nhật đường dẫn trả về để khớp với nơi lưu file
        $relativePath = "images/{$perfix}/{$filename}";

        return response()->json([
            'url'  => asset($relativePath),
            'path' => $relativePath,
        ], 201);
    }

    // --- Upload Gallery ---
    public function uploadMultiple(Request $request)
    {
        $validated = $request->validate([
            'perfix' => ['required', 'string', 'max:255'],
            'slug'   => ['required', 'string', 'max:255'],
            'images'   => ['required', 'array', 'max:50'],
            'images.*' => ['file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $slug = Str::slug($validated['slug']);
        $perfix = $validated['perfix'];

        // --- ĐÃ SỬA ---
        // Tương tự, đổi public_path() thành base_path() trỏ vào public_html
        $uploadPath = base_path("public_html/images/{$perfix}");

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $timestamp = Carbon::now()->format('Ymd_His');
        $urls  = [];
        $paths = [];
        $i = 1;

        foreach ($validated['images'] as $file) {
            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename = "{$slug}_gallery_{$i}_{$timestamp}.{$ext}";
            $file->move($uploadPath, $filename);

            // --- ĐÃ SỬA ---
            // Cập nhật đường dẫn trả về để khớp với nơi lưu file
            $relativePath = "images/{$perfix}/{$filename}";

            $urls[]  = asset($relativePath);
            $paths[] = $relativePath;
            $i++;
        }

        return response()->json([
            'urls'  => $urls,
            'paths' => $paths,
        ], 201);
    }

    // --- Xóa file ---
    public function deleteFile(Request $request)
    {
        $request->validate(['path' => ['required', 'string']]);

        // --- ĐÃ SỬA ---
        // Hàm xóa cũng cần được cập nhật để trỏ đúng vào public_html
        // $request->input('path') sẽ là 'images/products/file.jpg'
        // nên chúng ta nối chuỗi nó với base_path("public_html/")
        $path = base_path("public_html/" . $request->input('path'));

        if (file_exists($path)) {
            unlink($path);
            return response()->json(['deleted' => true]);
        }

        return response()->json(['deleted' => false, 'message' => 'File not found'], 404);
    }
}

