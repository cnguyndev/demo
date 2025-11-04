<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * GET /setting
     * Lấy bản ghi cài đặt đầu tiên; nếu chưa có trả 404 để FE biết hiển thị form trống.
     */
    public function index()
    {
        $setting = Setting::first();
        if (!$setting) {
            return response()->json(null, 404);
        }
        return response()->json($setting, 200);
    }

    /**
     * POST /setting
     * Tạo mới Setting khi CHƯA có bản ghi nào.
     * Nếu đã tồn tại, trả 409 để FE không tạo trùng (FE sẽ dùng PUT khi đã có).
     */
    public function store(Request $request)
    {
        // Nếu đã có 1 setting rồi thì không cho tạo thêm
        if (Setting::query()->exists()) {
            return response()->json(['message' => 'Cài đặt đã tồn tại. Hãy dùng PUT /setting/{id} để cập nhật.'], 409);
        }

        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'slogan'    => ['nullable', 'string', 'max:255'],
            'email'     => ['nullable', 'email', 'max:255'],
            'phone'     => ['nullable', 'string', 'max:50'],
            'hotline'   => ['nullable', 'string', 'max:50'],
            'address'   => ['nullable', 'string', 'max:500'],
            'logo'      => ['nullable', 'string', 'max:1000'],
            'favicon'   => ['nullable', 'string', 'max:1000'],
            'created_by'=> ['nullable', 'integer'],
        ]);

        $setting = new Setting();
        $setting->site_name = $data['site_name'] ?? null;
        $setting->slogan    = $data['slogan'] ?? null;
        $setting->email     = $data['email'] ?? null;
        $setting->phone     = $data['phone'] ?? null;
        $setting->hotline   = $data['hotline'] ?? null;
        $setting->address   = $data['address'] ?? null;
        $setting->logo      = $data['logo'] ?? null;
        $setting->favicon   = $data['favicon'] ?? null;
        $setting->created_by= $data['created_by'] ?? null;
        $setting->save();

        return response()->json($setting, 201);
    }

    /**
     * PUT /setting/{id}
     * Cập nhật Setting theo id (khớp FE: PUT /setting/${settingData.id})
     */
    public function update(Request $request, $id)
    {
        $setting = Setting::find($id);
        if (!$setting) {
            return response()->json(['message' => 'Không tìm thấy cài đặt.'], 404);
        }

        $data = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'slogan'    => ['nullable', 'string', 'max:255'],
            'email'     => ['nullable', 'email', 'max:255'],
            'phone'     => ['nullable', 'string', 'max:50'],
            'hotline'   => ['nullable', 'string', 'max:50'],
            'address'   => ['nullable', 'string', 'max:500'],
            'logo'      => ['nullable', 'string', 'max:1000'],
            'favicon'   => ['nullable', 'string', 'max:1000'],
            'updated_by'=> ['nullable', 'integer'],
        ]);

        // Gán từng trường nếu có trong request
        foreach ([
            'site_name', 'slogan', 'email', 'phone', 'hotline',
            'address', 'logo', 'favicon'
        ] as $field) {
            if ($request->has($field)) {
                $setting->{$field} = $data[$field] ?? null;
            }
        }

        if ($request->has('updated_by')) {
            $setting->updated_by = $data['updated_by'];
        }

        $setting->save();

        return response()->json($setting, 200);
    }
}
