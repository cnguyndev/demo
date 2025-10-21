-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2025 at 01:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cdtt_backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_attribute`
--

CREATE TABLE `ltcn_attribute` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_attribute`
--

INSERT INTO `ltcn_attribute` (`id`, `name`) VALUES
(1, 'Màu sắc'),
(2, 'Kích thước'),
(3, 'Chất liệu'),
(4, 'Thương hiệu'),
(5, 'Xuất xứ'),
(6, 'Kiểu dáng'),
(7, 'Phong cách'),
(8, 'Giới tính'),
(9, 'Mùa'),
(10, 'Độ dày');

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_banner`
--

CREATE TABLE `ltcn_banner` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `position` varchar(255) NOT NULL DEFAULT 'slideshow',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_banner`
--

INSERT INTO `ltcn_banner` (`id`, `name`, `image`, `link`, `position`, `sort_order`, `description`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Homepage Hero 1', '/uploads/banners/hero1.jpg', '/san-pham/noi-bat', 'slideshow', 1, 'Khuyến mãi tuần lễ vàng', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 'Homepage Hero 2', '/uploads/banners/hero2.jpg', '/san-pham/giam-gia', 'slideshow', 2, 'Giảm giá tới 50%', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(3, 'Homepage Hero 3', '/uploads/banners/hero3.jpg', '/bo-suu-tap/mua-moi', 'slideshow', 3, 'Bộ sưu tập mùa mới', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(4, 'Sidebar Deal 1', '/uploads/banners/sidebar1.jpg', '/san-pham/flash-sale', 'sidebar', 1, 'Flash sale hôm nay', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(5, 'Sidebar Deal 2', '/uploads/banners/sidebar2.jpg', '/san-pham/ban-chay', 'sidebar', 2, 'Sản phẩm bán chạy', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(6, 'Footer Promo 1', '/uploads/banners/footer1.jpg', '/chinh-sach/doi-tra', 'footer', 1, 'Đổi trả miễn phí 7 ngày', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(7, 'Footer Promo 2', '/uploads/banners/footer2.jpg', '/chinh-sach/van-chuyen', 'footer', 2, 'Miễn phí vận chuyển', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(8, 'Category Highlight 1', '/uploads/banners/cat1.jpg', '/danh-muc/thoi-trang-nam', 'homepage_block', 1, 'Thời trang nam', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(9, 'Category Highlight 2', '/uploads/banners/cat2.jpg', '/danh-muc/thoi-trang-nu', 'homepage_block', 2, 'Thời trang nữ', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(10, 'New Arrival', '/uploads/banners/new.jpg', '/san-pham/moi-ve', 'slideshow', 4, 'Hàng mới về mỗi tuần', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(11, 'Member Perk', '/uploads/banners/member.jpg', '/uu-dai/thanh-vien', 'sidebar', 3, 'Ưu đãi thành viên', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(12, 'Gift Season', '/uploads/banners/gift.jpg', '/qua-tang', 'slideshow', 5, 'Mùa quà tặng', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(16, 'Test create', '/uploads/banner_test-create_20251001_204339.png', 'Test create', 'slideshow', 1, 'Test create', 1, '2025-10-01 13:43:39', 1, NULL, NULL),
(17, 'cá', 'http://localhost/letranchinhnguyen-backend/public/banners/ca_thumbnail_20251015_125732.png', 'ccas', 'slideshow', 1, NULL, 1, '2025-10-15 12:57:33', 16, '2025-10-15 12:57:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_category`
--

CREATE TABLE `ltcn_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_category`
--

INSERT INTO `ltcn_category` (`id`, `name`, `slug`, `image`, `parent_id`, `sort_order`, `description`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Thời trang nam', 'thoi-trang-nam', '/uploads/categories/men.jpg', 0, 1, 'Bộ sưu tập cho nam', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 'Thời trang nữ', 'thoi-trang-nu', '/uploads/categories/women.jpg', 0, 2, 'Bộ sưu tập cho nữ', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(3, 'Phụ kiện', 'phu-kien', '/uploads/categories/accessories.jpg', 0, 3, 'Phụ kiện thời trang', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(4, 'Giày dép', 'giay-dep', '/uploads/categories/shoes.jpg', 0, 4, 'Giày dép các loại', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(5, 'Đồ thể thao', 'do-the-thao', '/uploads/categories/sport.jpg', 0, 5, 'Trang phục thể thao', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(6, 'Áo sơ mi nam', 'ao-so-mi-nam', '/uploads/categories/men-shirt.jpg', 1, 1, 'Áo sơ mi dành cho nam', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(7, 'Quần jean nam', 'quan-jean-nam', '/uploads/categories/men-jeans.jpg', 1, 2, 'Quần jean nam', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(8, 'Áo thun nữ', 'ao-thun-nu', '/uploads/categories/women-tee.jpg', 2, 1, 'Áo thun nữ nhiều mẫu', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(9, 'Đầm váy', 'dam-vay', '/uploads/categories/dress.jpg', 2, 2, 'Đầm váy thời trang', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(10, 'Túi xách', 'tui-xach', '/uploads/categories/bag.jpg', 3, 1, 'Túi xách các loại', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(11, 'Thắt lưng', 'that-lung', '/uploads/categories/belt.jpg', 3, 2, 'Thắt lưng da', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(12, 'Giày thể thao nam', 'giay-the-thao-nam', '/uploads/categories/sneaker-men.jpg', 4, 1, 'Sneakers nam', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(13, 'Giày cao gót', 'giay-cao-got', '/uploads/categories/high-heels.jpg', 4, 2, 'Giày cao gót nữ', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(14, 'Áo thể thao', 'ao-the-thao', '/uploads/categories/sport-tee.jpg', 5, 1, 'Áo tập luyện', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(15, 'Quần thể thao', 'quan-the-thao', '/uploads/categories/sport-pants.jpg', 5, 2, 'Quần tập luyện', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(16, 'dsa 0as sj', 'dsa-0as-sj', '/uploads/category_dsa-0as-sj_20250926_092302.png', 2, 3, NULL, 1, '2025-09-26 02:23:02', 1, NULL, NULL),
(17, 'ssac f', 'ssac-f', '/uploads/category_ssac-f_20250926_092337.png', 1, 6, '123', 1, '2025-09-26 02:23:37', 1, NULL, NULL),
(18, 'Test 123 123', 'test-123-123', '/uploads/category_test-123-123_20250926_094016.png', 0, 1, '123', 1, '2025-09-26 02:30:14', 1, '2025-09-26 02:40:16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_contact`
--

CREATE TABLE `ltcn_contact` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `reply_id` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_contact`
--

INSERT INTO `ltcn_contact` (`id`, `user_id`, `name`, `email`, `phone`, `content`, `reply_id`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 1, 'Nguyễn Văn A', 'a@example.com', '0900000001', 'Tôi muốn hỏi về tình trạng đơn hàng #1001.', 0, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, NULL, 'Trần Thị B', 'b@example.com', '0900000002', 'Shop có chính sách đổi trả như thế nào?', 0, 1, '2025-09-10 06:58:54', 1, NULL, NULL),
(3, 2, 'Lê Văn C', 'c@example.com', '0900000003', 'Sản phẩm áo thun mã AT-01 còn size M không?', 0, 1, '2025-09-10 06:53:54', 1, NULL, NULL),
(4, 3, 'Phạm D', 'd@example.com', '0900000004', 'Tôi cần xuất hoá đơn VAT cho đơn #1005.', 0, 1, '2025-09-10 06:48:54', 1, NULL, NULL),
(5, NULL, 'Hoàng E', 'e@example.com', '0900000005', 'Phí vận chuyển về Hà Nội là bao nhiêu?', 0, 1, '2025-09-10 06:43:54', 1, NULL, NULL),
(6, 4, 'Đỗ F', 'f@example.com', '0900000006', 'Tôi muốn huỷ đơn #1010.', 0, 1, '2025-09-10 06:38:54', 1, NULL, NULL),
(9, 1, 'CSKH', 'support@example.com', '0900999999', 'Chúng tôi đã tiếp nhận yêu cầu đơn #1001. Vui lòng kiểm tra email xác nhận.', 1, 1, '2025-09-10 07:05:54', 1, NULL, NULL),
(10, 2, 'CSKH', 'support@example.com', '0900999999', 'AT-01 còn đủ size M và L. Bạn cần hỗ trợ đặt hàng không?', 3, 1, '2025-09-10 07:06:54', 1, NULL, NULL),
(11, NULL, 'CSKH', 'support@example.com', '0900999999', 'Chính sách đổi trả trong 7 ngày, giữ nguyên tem mác và hoá đơn.', 2, 1, '2025-09-10 07:07:54', 1, NULL, NULL),
(12, 3, 'CSKH', 'support@example.com', '0900999999', 'Chúng tôi sẽ xuất hoá đơn VAT cho đơn #1005 trong 24h.', 4, 1, '2025-09-10 07:08:54', 1, NULL, NULL),
(13, NULL, 'CSKH', 'support@example.com', '0900999999', 'Phí vận chuyển nội thành HN là 20.000đ, miễn phí cho đơn từ 500.000đ.', 5, 1, '2025-09-10 07:09:54', 1, NULL, NULL),
(14, 4, 'CSKH', 'support@example.com', '0900999999', 'Đơn #1010 đã được huỷ theo yêu cầu.', 6, 1, '2025-09-10 07:10:54', 1, NULL, NULL),
(15, 1, 'CSKH', 'support@example.com', '0123456789', 'Test', 8, 1, '2025-09-26 10:30:13', 1, NULL, NULL),
(16, 1, 'CSKH', 'support@example.com', '0123456789', 'Test', 8, 1, '2025-09-26 10:30:20', 1, NULL, NULL),
(17, 1, 'CSKH', 'support@example.com', '0123456789', 'Test', 8, 1, '2025-09-26 10:30:40', 1, NULL, NULL),
(19, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test', 0, 1, '2025-10-18 03:20:40', 16, '2025-10-18 03:29:54', NULL),
(20, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test', 0, 0, '2025-10-18 03:26:46', 16, '2025-10-18 03:43:21', NULL),
(21, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test', 0, 0, '2025-10-18 03:26:54', 16, '2025-10-18 03:52:48', NULL),
(22, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test', 0, 1, '2025-10-18 03:27:12', 16, '2025-10-18 03:27:12', NULL),
(23, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test rep', 19, 1, '2025-10-18 03:29:54', 16, '2025-10-18 03:29:54', NULL),
(24, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test email', 20, 1, '2025-10-18 03:43:14', 16, '2025-10-18 03:43:14', NULL),
(25, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test rep 1', 21, 1, '2025-10-18 03:52:42', 16, '2025-10-18 03:52:42', NULL),
(26, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Test liên hệ', 0, 0, '2025-10-21 10:44:29', 16, '2025-10-21 10:44:49', NULL),
(27, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'Hehe', 26, 1, '2025-10-21 10:44:43', 16, '2025-10-21 10:44:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_menu`
--

CREATE TABLE `ltcn_menu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_menu`
--

INSERT INTO `ltcn_menu` (`id`, `name`, `link`, `type`, `parent_id`, `sort_order`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Trang chủ', '/', 'navbar', 0, 1, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 'Sản phẩm', '/san-pham', 'navbar', 0, 2, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(3, 'Bài viết', '/bai-viet', 'navbar', 0, 3, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(4, 'Giới thiệu', '/gioi-thieu', 'navbar', 0, 4, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(5, 'Liên hệ', '/lien-he', 'navbar', 0, 5, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(6, 'Thời trang nam', '/danh-muc/nam', 'category', 2, 1, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(7, 'Thời trang nữ', '/danh-muc/nu', 'footer1', 2, 2, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(8, 'Phụ kiện', '/danh-muc/phu-kien', 'category', 2, 3, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(9, 'Tin tức', '/chu-de/tin-tuc', 'topic', 3, 1, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(10, 'Hướng dẫn', '/chu-de/huong-dan', 'topic', 3, 2, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(11, 'Ưu đãi', '/uu-dai', 'link', 0, 6, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(12, 'FAQ', '/faq', 'link', 4, 1, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(13, 'Test Menu', '/url', 'navbar', 3, 6, 1, '2025-09-11 08:52:05', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_migrations`
--

CREATE TABLE `ltcn_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_migrations`
--

INSERT INTO `ltcn_migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_09_09_103727_create_banner_table', 1),
(2, '2025_09_09_104052_create_contact_table', 1),
(3, '2025_09_09_104323_create_category_table', 1),
(4, '2025_09_09_104632_create_product_table', 1),
(5, '2025_09_09_104847_create_product_image_table', 1),
(6, '2025_09_09_105025_create_product_sale_table', 1),
(7, '2025_09_09_105151_create_attribute_table', 1),
(8, '2025_09_09_105311_create_product_attribute_table', 1),
(9, '2025_09_09_105439_create_product_store_table', 1),
(10, '2025_09_09_105611_create_order_table', 1),
(11, '2025_09_09_105804_create_order_detail_table', 1),
(12, '2025_09_09_105941_create_post_table', 1),
(13, '2025_09_09_110126_create_topic_table', 1),
(14, '2025_09_09_110454_create_user_table', 1),
(15, '2025_09_09_110721_create_menu_table', 1),
(16, '2025_09_09_110954_create_setting_table', 1),
(17, '2025_09_10_065857_create_social_table', 1),
(18, '2025_09_10_065940_create_social_icon_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_order`
--

CREATE TABLE `ltcn_order` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_order`
--

INSERT INTO `ltcn_order` (`id`, `user_id`, `name`, `email`, `phone`, `address`, `note`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 9, 'Khách hàng 1', 'customer1@example.com', '0900000001', 'Số 1, Đường ABC, Quận XYZ, TP.HCM', NULL, 3, '2025-09-09 07:03:54', 1, '2025-09-26 11:30:17', 1),
(2, 10, 'Khách hàng 2', 'customer2@example.com', '0900000002', 'Số 2, Đường ABC, Quận XYZ, TP.HCM', 'Giao giờ hành chính', 2, '2025-09-08 07:03:54', 1, NULL, NULL),
(3, 10, 'Khách hàng 3', 'customer3@example.com', '0900000003', 'Số 3, Đường ABC, Quận XYZ, TP.HCM', NULL, 2, '2025-09-07 07:03:54', 1, NULL, NULL),
(4, 6, 'Khách hàng 4', 'customer4@example.com', '0900000004', 'Số 4, Đường ABC, Quận XYZ, TP.HCM', 'Giao giờ hành chính', 1, '2025-09-06 07:03:54', 1, NULL, NULL),
(5, 6, 'Khách hàng 5', 'customer5@example.com', '0900000005', 'Số 5, Đường ABC, Quận XYZ, TP.HCM', NULL, 1, '2025-09-05 07:03:54', 1, NULL, NULL),
(6, 9, 'Khách hàng 6', 'customer6@example.com', '0900000006', 'Số 6, Đường ABC, Quận XYZ, TP.HCM', 'Giao giờ hành chính', 1, '2025-09-04 07:03:54', 1, NULL, NULL),
(7, 3, 'Khách hàng 7', 'customer7@example.com', '0900000007', 'Số 7, Đường ABC, Quận XYZ, TP.HCM', NULL, 0, '2025-09-03 07:03:54', 1, NULL, NULL),
(8, 6, 'Khách hàng 8', 'customer8@example.com', '0900000008', 'Số 8, Đường ABC, Quận XYZ, TP.HCM', 'Giao giờ hành chính', 0, '2025-09-02 07:03:54', 1, NULL, NULL),
(9, 6, 'Khách hàng 9', 'customer9@example.com', '0900000009', 'Số 9, Đường ABC, Quận XYZ, TP.HCM', NULL, 1, '2025-09-01 07:03:54', 1, NULL, NULL),
(10, 9, 'Khách hàng 10', 'customer10@example.com', '0900000010', 'Số 10, Đường ABC, Quận XYZ, TP.HCM', 'Giao giờ hành chính', 1, '2025-08-31 07:03:54', 1, NULL, NULL),
(11, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:44:15', 16, '2025-10-12 14:44:15', NULL),
(12, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:47:44', 16, '2025-10-12 14:47:44', NULL),
(13, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:49:16', 16, '2025-10-12 14:49:16', NULL),
(14, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:50:53', 16, '2025-10-12 14:50:53', NULL),
(15, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:51:31', 16, '2025-10-12 14:51:31', NULL),
(16, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 14:54:43', 16, '2025-10-12 14:54:43', NULL),
(17, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 1, '2025-10-12 14:56:11', 16, '2025-10-12 15:23:24', NULL),
(18, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 15:09:07', 16, '2025-10-12 15:09:07', NULL),
(19, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 15:10:18', 16, '2025-10-12 15:10:18', NULL),
(20, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 15:11:53', 16, '2025-10-12 15:11:53', NULL),
(21, 16, 'Lê Nguyên A', 'admin@nioo.io.vn', '0849081205', 'abc, 123, 123', NULL, 0, '2025-10-12 15:17:22', 16, '2025-10-12 15:17:22', NULL),
(22, 16, 'Lê Nguyên sd', 'admin@nioo.io.vn', '0849081205', 'sđs, sđs, dssd', NULL, 0, '2025-10-12 15:17:49', 16, '2025-10-12 15:17:49', NULL),
(23, 16, 'Lê Nguyên sd', 'admin@nioo.io.vn', '0849081205', 'sđs, sđs, dssd', NULL, 0, '2025-10-12 15:22:28', 16, '2025-10-12 15:22:28', NULL),
(24, 16, 'Lê Nguyên sad', 'admin@nioo.io.vn', '0849081205', 'ádas, dsad, sadad', NULL, 0, '2025-10-12 15:25:02', 16, '2025-10-12 15:25:02', NULL),
(25, 16, 'Lê Nguyên scd', 'admin@nioo.io.vn', '0849081205', 'dsc, ds, sdf', NULL, 1, '2025-10-12 15:36:10', 16, '2025-10-12 15:41:44', 0),
(26, 16, 'Lê Nguyên scaa', 'admin@nioo.io.vn', '0849081205', 'ấc, ấc, sca', NULL, 0, '2025-10-12 15:44:11', 16, '2025-10-12 15:44:11', NULL),
(27, 16, 'Lê Nguyên cá', 'admin@nioo.io.vn', '0849081205', 'cá, ấc, ác', NULL, 0, '2025-10-12 15:47:43', 16, '2025-10-12 15:47:43', NULL),
(28, 16, 'Lê Nguyên sdv', 'admin@nioo.io.vn', '0849081205', 'dscsd, dscs, sdf', NULL, 0, '2025-10-12 15:50:24', 16, '2025-10-12 15:50:24', NULL),
(29, 16, 'Lê Nguyên hj', 'admin@nioo.io.vn', '0849081205', 'j, h`kj, kl', NULL, 1, '2025-10-12 15:53:02', 16, '2025-10-12 15:53:13', NULL),
(30, 16, 'Lê Nguyên sdf', 'admin@nioo.io.vn', '0849081205', 'sdf, sdf, sd', NULL, 0, '2025-10-12 15:53:54', 16, '2025-10-12 15:53:54', NULL),
(31, 16, 'Lê Nguyên cấ', 'admin@nioo.io.vn', '0849081205', 'scaca, cá, cá', NULL, 0, '2025-10-14 07:13:42', 16, '2025-10-14 07:13:42', NULL),
(32, 16, 'Lê Nguyên cá', 'admin@nioo.io.vn', '0849081205', 'ấc, cá, cá', NULL, 0, '2025-10-14 07:17:18', 16, '2025-10-14 07:17:18', NULL),
(33, 16, 'Lê Nguyên jhbh', 'admin@nioo.io.vn', '0849081205', 'jhbjk, ljh, kjh', NULL, 1, '2025-10-14 07:25:55', 16, '2025-10-14 07:26:12', NULL),
(34, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ABC', '111', 0, '2025-10-14 08:08:12', 16, '2025-10-14 08:08:12', NULL),
(35, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'sd', 'fdsf', 1, '2025-10-14 08:21:19', 16, '2025-10-14 08:21:33', NULL),
(36, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'sacd', 'câs', 1, '2025-10-14 08:26:58', 16, '2025-10-14 08:28:30', NULL),
(37, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'sãd', 'ádas', 1, '2025-10-14 08:30:39', 16, '2025-10-14 08:30:52', NULL),
(38, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'cds', 'csdc', 0, '2025-10-14 08:38:13', 16, '2025-10-14 08:38:13', NULL),
(39, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'cds', 'cds', 0, '2025-10-14 10:03:08', 16, '2025-10-14 10:03:08', NULL),
(40, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '6545', '54', 0, '2025-10-14 10:05:00', 16, '2025-10-14 10:05:00', NULL),
(41, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dcs', 'scd', 0, '2025-10-14 10:11:05', 16, '2025-10-14 10:11:05', NULL),
(42, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '4564', '564', 0, '2025-10-14 10:11:41', 16, '2025-10-14 10:11:41', NULL),
(43, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'cá', 'cá', 0, '2025-10-14 10:13:05', 16, '2025-10-14 10:13:05', NULL),
(44, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '654', '5461', 0, '2025-10-14 10:14:09', 16, '2025-10-14 10:14:09', NULL),
(45, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '65465', '321', 1, '2025-10-14 10:15:17', 16, '2025-10-14 10:15:27', NULL),
(46, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'sdf', 'csa', 1, '2025-10-14 10:45:49', 16, '2025-10-14 10:46:03', NULL),
(47, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 's', 'CÁ', 1, '2025-10-14 10:59:33', 16, '2025-10-14 10:59:48', NULL),
(48, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'khljk', 'kbkj', 1, '2025-10-14 12:15:34', 16, '2025-10-14 12:15:57', NULL),
(49, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dv', 'vds', 1, '2025-10-14 12:33:40', 16, '2025-10-14 12:33:50', NULL),
(50, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dá', 'áda', 0, '2025-10-14 12:53:28', 16, '2025-10-14 12:53:28', NULL),
(51, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dá', 'áda', 0, '2025-10-14 12:53:57', 16, '2025-10-14 12:53:57', NULL),
(52, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dá', 'áda', 0, '2025-10-14 12:56:17', 16, '2025-10-14 12:56:17', NULL),
(53, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 0, '2025-10-14 12:57:54', 16, '2025-10-14 12:57:54', NULL),
(54, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 0, '2025-10-14 12:58:25', 16, '2025-10-14 12:58:25', NULL),
(55, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 0, '2025-10-14 13:01:13', 16, '2025-10-14 13:01:13', NULL),
(56, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 0, '2025-10-14 13:01:35', 16, '2025-10-21 11:11:37', NULL),
(57, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 1, '2025-10-14 13:03:15', 16, '2025-10-15 04:44:23', NULL),
(58, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 1, '2025-10-14 13:07:59', 16, '2025-10-21 10:15:20', NULL),
(59, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'ádasd', 1, '2025-10-14 13:08:39', 16, '2025-10-15 04:14:57', NULL),
(60, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'csaa', 'câs', 1, '2025-10-14 13:10:40', 16, '2025-10-15 04:31:03', NULL),
(61, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '655', 'jhhvjh', 1, '2025-10-14 13:12:01', 16, '2025-10-14 13:12:10', NULL),
(62, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', '51456', 'gfc', 1, '2025-10-14 13:12:42', 16, '2025-10-14 13:12:52', NULL),
(63, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ừes', 'scsfd', 1, '2025-10-14 13:15:38', 16, '2025-10-14 13:15:53', NULL),
(64, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'jkhlk', 'ljkhkl', 1, '2025-10-14 13:21:22', 16, '2025-10-14 13:21:33', NULL),
(65, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ứvdv', 'áccas', 1, '2025-10-15 01:36:00', 16, '2025-10-15 01:36:14', NULL),
(66, 18, 'Nguyên', 'ideological214@tiffincrane.com', '0123456789', 'jdsjkl', 'lkjasj', 1, '2025-10-15 03:15:05', 18, '2025-10-15 03:15:17', NULL),
(67, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'ádasd', 'áda', 0, '2025-10-17 12:18:36', 16, '2025-10-17 12:18:54', NULL),
(68, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'sdsd', 'fsdfs', 1, '2025-10-21 10:36:28', 16, '2025-10-21 10:36:41', NULL),
(69, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'test', NULL, 1, '2025-10-21 10:53:00', 16, '2025-10-21 10:53:23', NULL),
(70, 16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'dd', NULL, 0, '2025-10-21 10:54:06', 16, '2025-10-21 10:54:12', NULL),
(71, 16, 'Lê Nguyên âcs', 'admin@nioo.io.vn', '0849081201', 'sda', NULL, 1, '2025-10-21 10:55:42', 16, '2025-10-21 10:55:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_order_detail`
--

CREATE TABLE `ltcn_order_detail` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` decimal(15,0) NOT NULL,
  `qty` int(11) NOT NULL,
  `amount` decimal(15,0) NOT NULL,
  `discount` decimal(15,2) DEFAULT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_order_detail`
--

INSERT INTO `ltcn_order_detail` (`id`, `order_id`, `product_id`, `price`, `qty`, `amount`, `discount`, `status`) VALUES
(1, 1, 5, 83000, 5, 412000, 3000.00, 0),
(2, 2, 3, 156000, 2, 308000, 4000.00, 0),
(3, 2, 9, 90000, 4, 360000, 0.00, 0),
(4, 3, 8, 191000, 5, 943000, 12000.00, 1),
(5, 4, 7, 161000, 2, 302000, 20000.00, 0),
(6, 4, 8, 170000, 3, 506000, 4000.00, 1),
(7, 4, 9, 128000, 1, 117000, 11000.00, 0),
(8, 5, 1, 121000, 3, 345000, 18000.00, 0),
(9, 6, 2, 51000, 3, 134000, 19000.00, 0),
(10, 6, 9, 191000, 1, 184000, 7000.00, 0),
(11, 7, 1, 66000, 5, 316000, 14000.00, 0),
(12, 7, 12, 75000, 4, 280000, 20000.00, 0),
(13, 8, 5, 52000, 4, 205000, 3000.00, 0),
(14, 8, 7, 68000, 2, 133000, 3000.00, 0),
(15, 8, 9, 151000, 4, 603000, 1000.00, 0),
(16, 9, 5, 181000, 2, 361000, 1000.00, 0),
(17, 9, 6, 51000, 1, 44000, 7000.00, 0),
(18, 10, 10, 139000, 1, 129000, 10000.00, 0),
(19, 11, 42, 121, 1, 121, 0.00, 0),
(20, 12, 42, 121, 1, 121, 0.00, 0),
(21, 13, 42, 121, 1, 121, 0.00, 0),
(22, 14, 42, 121, 1, 121, 0.00, 0),
(23, 15, 42, 121, 1, 121, 0.00, 0),
(24, 16, 42, 121, 1, 121, 0.00, 0),
(25, 17, 42, 121, 1, 121, 0.00, 0),
(26, 18, 42, 121, 1, 121, 0.00, 0),
(27, 19, 42, 121, 1, 121, 0.00, 0),
(28, 20, 42, 121, 1, 121, 0.00, 0),
(29, 21, 42, 121, 1, 121, 0.00, 0),
(30, 22, 42, 121, 1, 121, 0.00, 0),
(31, 23, 42, 121, 1, 121, 0.00, 0),
(32, 24, 42, 121, 50, 6050, 0.00, 0),
(33, 25, 42, 121, 50, 6050, 0.00, 0),
(34, 26, 42, 121, 50, 6050, 0.00, 0),
(35, 27, 42, 121, 50, 6050, 0.00, 0),
(36, 28, 42, 121, 50, 6050, 0.00, 0),
(37, 29, 42, 121, 50, 6050, 0.00, 0),
(38, 30, 42, 121, 50, 6050, 0.00, 0),
(39, 31, 42, 121, 50, 6050, 0.00, 0),
(40, 32, 42, 121, 50, 6050, 0.00, 0),
(41, 33, 42, 121, 50, 6050, 0.00, 0),
(42, 34, 42, 121, 50, 6050, NULL, 0),
(43, 35, 42, 121, 50, 6050, NULL, 0),
(44, 36, 42, 121, 300, 36300, NULL, 0),
(45, 37, 8, 1880, 4, 7520, NULL, 1),
(46, 38, 39, 121, 1, 121, NULL, 0),
(47, 39, 39, 121, 20, 2420, NULL, 0),
(48, 40, 39, 121, 21, 2541, NULL, 0),
(49, 40, 34, 1234, 20, 24680, NULL, 0),
(50, 41, 39, 121, 21, 2541, NULL, 0),
(51, 41, 34, 1234, 20, 24680, NULL, 0),
(52, 42, 39, 121, 21, 2541, NULL, 0),
(53, 42, 34, 1234, 20, 24680, NULL, 0),
(54, 43, 39, 121, 21, 2541, NULL, 0),
(55, 43, 34, 1234, 20, 24680, NULL, 0),
(56, 44, 39, 121, 21, 2541, NULL, 0),
(57, 44, 34, 1234, 20, 24680, NULL, 0),
(58, 45, 39, 121, 21, 2541, NULL, 0),
(59, 45, 34, 1234, 20, 24680, NULL, 0),
(60, 46, 41, 1241, 1, 1241, NULL, 0),
(61, 47, 41, 1241, 1, 1241, NULL, 1),
(62, 48, 44, 1234, 50, 61700, NULL, 1),
(63, 49, 38, 123, 30, 3690, NULL, 1),
(64, 50, 44, 1234, 20, 24680, NULL, 0),
(65, 51, 44, 1234, 20, 24680, NULL, 0),
(66, 52, 44, 1234, 20, 24680, NULL, 0),
(67, 53, 44, 1234, 20, 24680, NULL, 0),
(68, 54, 44, 1234, 20, 24680, NULL, 0),
(69, 55, 44, 1234, 20, 24680, NULL, 0),
(70, 56, 44, 1234, 20, 24680, NULL, 1),
(71, 57, 44, 1234, 20, 24680, NULL, 1),
(72, 58, 44, 1234, 20, 24680, NULL, 1),
(73, 59, 44, 1234, 20, 24680, NULL, 1),
(74, 60, 44, 1234, 20, 24680, NULL, 1),
(75, 61, 44, 1234, 20, 24680, NULL, 1),
(76, 62, 44, 1234, 20, 24680, NULL, 1),
(77, 63, 44, 1234, 20, 24680, NULL, 1),
(78, 64, 44, 1234, 20, 24680, NULL, 1),
(79, 65, 44, 1234, 30, 37020, NULL, 1),
(80, 66, 44, 1234, 7, 8638, NULL, 1),
(81, 67, 41, 1241, 1, 1241, NULL, 1),
(82, 68, 42, 1234, 30, 37020, NULL, 1),
(83, 69, 44, 1234, 30, 37020, NULL, 1),
(84, 70, 44, 1234, 2, 2468, NULL, 1),
(85, 71, 44, 1234, 2, 2468, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_post`
--

CREATE TABLE `ltcn_post` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_post`
--

INSERT INTO `ltcn_post` (`id`, `topic_id`, `title`, `slug`, `image`, `content`, `description`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 1, 'Khai trương cửa hàng mới', 'khai-truong-cua-hang-moi', '/uploads/posts/opening.jpg', 'Chúng tôi chính thức khai trương cửa hàng mới với nhiều ưu đãi.', 'Thông báo khai trương', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 1, 'Ưu đãi tháng này', 'uu-dai-thang-nay', '/uploads/posts/promo-month.jpg', 'Nhiều chương trình khuyến mãi áp dụng trong tháng.', 'Tổng hợp ưu đãi', 1, '2025-09-10 07:01:54', 1, NULL, NULL),
(3, 2, 'Hướng dẫn chọn size áo', 'huong-dan-chon-size-ao', '/uploads/posts/size-guide.jpg', 'Cách đo và chọn size áo phù hợp cho bạn.', 'Size guide áo', 1, '2025-09-10 06:59:54', 1, NULL, NULL),
(4, 2, 'Bảo quản quần jean đúng cách', 'bao-quan-quan-jean-dung-cach', '/uploads/posts/jeans-care.jpg', 'Các mẹo giúp quần jean bền màu và giữ form.', 'Mẹo bảo quản jeans', 1, '2025-09-10 06:57:54', 1, NULL, NULL),
(5, 3, 'Xu hướng thời trang thu', 'xu-huong-thoi-trang-thu', '/uploads/posts/fall-trend.jpg', 'Những item nổi bật cho mùa thu năm nay.', 'Trend mùa thu', 1, '2025-09-10 06:55:54', 1, NULL, NULL),
(6, 3, 'Mix đồ basic cho nam', 'mix-do-basic-cho-nam', '/uploads/posts/mix-basic-men.jpg', 'Gợi ý phối đồ đơn giản nhưng hiệu quả.', 'Phối đồ basic nam', 1, '2025-09-10 06:53:54', 1, NULL, NULL),
(7, 4, 'Chính sách đổi trả', 'chinh-sach-doi-tra', '/uploads/posts/return-policy.jpg', 'Quy định đổi trả trong 7 ngày với điều kiện kèm theo.', 'Quy định đổi trả', 1, '2025-09-10 06:51:54', 1, NULL, NULL),
(8, 4, 'Hướng dẫn thanh toán', 'huong-dan-thanh-toan', '/uploads/posts/payment-guide.jpg', 'Các phương thức thanh toán được hỗ trợ.', 'Cách thanh toán', 1, '2025-09-10 06:49:54', 1, NULL, NULL),
(9, NULL, 'Câu chuyện thương hiệu', 'cau-chuyen-thuong-hieu', '/uploads/posts/brand-story.jpg', 'Hành trình xây dựng và phát triển của chúng tôi.', 'Giới thiệu thương hiệu', 1, '2025-09-10 06:47:54', 1, NULL, NULL),
(10, NULL, 'Tuyển dụng nhân sự', 'tuyen-dung-nhan-su', '/uploads/posts/careers.jpg', 'Cơ hội gia nhập đội ngũ với nhiều vị trí.', 'Tin tuyển dụng', 1, '2025-09-10 06:45:54', 1, NULL, NULL),
(11, 5, 'Quà tặng mùa lễ hội', 'qua-tang-mua-le-hoi', '/uploads/posts/gift-season.jpg', 'Gợi ý quà tặng thiết thực cho người thân.', 'Gợi ý quà tặng', 1, '2025-09-10 06:43:54', 1, NULL, NULL),
(12, 5, 'Combo tiết kiệm', 'combo-tiet-kiem', '/uploads/posts/combo.jpg', 'Các gói combo giúp tối ưu chi phí mua sắm.', 'Chương trình combo', 1, '2025-09-10 06:41:54', 1, NULL, NULL),
(14, 1, 'handleFormChange', 'handleformchange', 'http://localhost/letranchinhnguyen-backend/public/posts/handleformchange_thumbnail_20251007_063352.png', '<p>handleFormChange</p>', 'handleFormChange', 1, '2025-10-07 06:33:53', 1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_product`
--

CREATE TABLE `ltcn_product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `description` text DEFAULT NULL,
  `price_buy` decimal(15,2) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_product`
--

INSERT INTO `ltcn_product` (`id`, `category_id`, `name`, `slug`, `thumbnail`, `content`, `description`, `price_buy`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 9, 'Áo thun cổ tròn nam Basic', 'ao-thun-co-tron-nam-basic', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Áo thun cổ tròn nam Basic.', 'Sản phẩm chất lượng cao Áo thun cổ tròn nam Basic.', 5830.00, 0, '2025-09-11 07:03:54', 1, '2025-10-03 10:22:42', 1),
(2, 5, 'Áo sơ mi tay dài Oxford', 'ao-so-mi-tay-dai-oxford-2', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Áo sơ mi tay dài Oxford.', 'Sản phẩm chất lượng cao Áo sơ mi tay dài Oxford.', 51000.00, 1, '2025-09-10 07:01:54', 1, NULL, NULL),
(3, 15, 'Quần jean slim fit xanh đậm', 'quan-jean-slim-fit-xanh-dam-3', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Quần jean slim fit xanh đậm.', 'Sản phẩm chất lượng cao Quần jean slim fit xanh đậm.', 10860.00, 1, '2025-09-10 06:59:54', 1, NULL, NULL),
(4, 5, 'Quần short kaki nam', 'quan-short-kaki-nam-4', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Quần short kaki nam.', 'Sản phẩm chất lượng cao Quần short kaki nam.', 9140.00, 1, '2025-09-10 06:57:54', 1, NULL, NULL),
(5, 15, 'Đầm midi tay phồng', 'dam-midi-tay-phong-5', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Đầm midi tay phồng.', 'Sản phẩm chất lượng cao Đầm midi tay phồng.', 2850.00, 1, '2025-09-10 06:55:54', 1, NULL, NULL),
(6, 14, 'Áo thun nữ form rộng', 'ao-thun-nu-form-rong-6', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Áo thun nữ form rộng.', 'Sản phẩm chất lượng cao Áo thun nữ form rộng.', 5990.00, 1, '2025-09-10 06:53:54', 1, NULL, NULL),
(7, 8, 'Giày sneaker classic trắng', 'giay-sneaker-classic-trang-7', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Giày sneaker classic trắng.', 'Sản phẩm chất lượng cao Giày sneaker classic trắng.', 4660.00, 1, '2025-09-10 06:51:54', 1, NULL, NULL),
(8, 11, 'Giày cao gót 7cm', 'giay-cao-got-7cm-8', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Giày cao gót 7cm.', 'Sản phẩm chất lượng cao Giày cao gót 7cm.', 1880.00, 1, '2025-09-10 06:49:54', 1, NULL, NULL),
(9, 2, 'Túi xách da mini', 'tui-xach-da-mini-9', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Túi xách da mini.', 'Sản phẩm chất lượng cao Túi xách da mini.', 8520.00, 1, '2025-09-10 06:47:54', 1, NULL, NULL),
(10, 10, 'Thắt lưng da bản nhỏ', 'that-lung-da-ban-nho-10', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Thắt lưng da bản nhỏ.', 'Sản phẩm chất lượng cao Thắt lưng da bản nhỏ.', 11710.00, 1, '2025-09-10 06:45:54', 1, NULL, NULL),
(11, 1, 'Áo thể thao dry-fit', 'ao-the-thao-dry-fit-11', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Áo thể thao dry-fit.', 'Sản phẩm chất lượng cao Áo thể thao dry-fit.', 7720.00, 1, '2025-09-10 06:43:54', 1, NULL, NULL),
(12, 7, 'Quần jogger thể thao', 'quan-jogger-the-thao-12', '/images/products/product_placeholder.webp', 'Mô tả chi tiết sản phẩm Quần jogger thể thao.', 'Sản phẩm chất lượng cao Quần jogger thể thao.', 11510.00, 1, '2025-09-23 06:41:54', 1, NULL, NULL),
(31, 13, 'Áo sơ mi nam 1212', 'ao-so-mi-nam-1212', 'http://localhost/letranchinhnguyen-backend/public/storage/uploads/images/2025/10/05/Y3N4Z3IGywdByp2pquZAtgjWwx5HSx5ysUvosYLk.png', '<p>&Aacute;o sơ mi nam 1212</p>', 'Áo sơ mi nam 1212', 1234.00, 1, '2025-10-05 01:33:24', 1, '2025-10-05 01:33:24', NULL),
(32, 7, 'Áo sơ mi nam 12121', 'ao-so-mi-nam-12121', 'http://localhost/letranchinhnguyen-backend/public/storage/products/ao-so-mi-nam-12121_thumbnail_1759628357.png', '<p>&Aacute;o sơ mi nam 12121</p>', 'Áo sơ mi nam 12121', 1234.00, 1, '2025-10-05 01:39:17', 1, '2025-10-05 01:39:17', NULL),
(33, 6, 'Test 123', 'test-123', 'http://localhost/letranchinhnguyen-backend/public/products/test-123_thumbnail_20251005_014418.png', '<p>Test 123</p>', 'Test 123', 123.00, 1, '2025-10-05 01:44:19', 1, '2025-10-05 01:44:19', NULL),
(34, 12, 'Áo sơ mi nam 12121', 'ao-so-mi-nam-12121', 'http://localhost/letranchinhnguyen-backend/public/products/products/ao-so-mi-nam-12121_thumbnail_20251007_062307.png', '<p>&Aacute;o sơ mi nam 1212</p>', 'Áo sơ mi nam 1212', 1234.00, 1, '2025-10-07 06:23:08', 1, '2025-10-07 06:23:08', NULL),
(35, 4, 'Test', 'test', 'http://localhost/letranchinhnguyen-backend/public/products/test_thumbnail_20251007_062422.png', '<p>Test</p>', 'Test', 1234.00, 1, '2025-10-07 06:24:23', 1, '2025-10-07 06:24:23', NULL),
(36, 6, 'Áo sơ mi nam 121212131', 'ao-so-mi-nam-121212131', 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121212131_thumbnail_20251007_125400.png', '<p>&Aacute;o sơ mi nam 121212131</p>', 'Áo sơ mi nam 121212131', 1234.00, 1, '2025-10-07 12:54:01', 1, '2025-10-07 12:54:01', NULL),
(37, 7, 'TestTest', 'testtest', 'http://localhost/letranchinhnguyen-backend/public/products/testtest_thumbnail_20251007_125614.png', '<p>Test</p>', 'Test', 1234.00, 1, '2025-10-07 12:56:14', 1, '2025-10-07 12:56:14', NULL),
(38, 7, 'Áo sơ mi nam 121211', 'ao-so-mi-nam-121211', 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121211_thumbnail_20251007_125851.png', '<p>&Aacute;o sơ mi nam 121211</p>', 'Áo sơ mi nam 121211', 123.00, 1, '2025-10-07 12:58:51', 1, '2025-10-07 12:58:51', NULL),
(39, 4, 'Áo sơ mi nam 12121w1wqsaxs', 'ao-so-mi-nam-12121w1wqsaxs', 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-12121w1wqsaxs_thumbnail_20251007_130007.png', '<p>&Aacute;o sơ mi nam 12121w1wqsaxs</p>', 'Áo sơ mi nam 12121w1wqsaxs', 121.00, 1, '2025-10-07 13:00:08', 1, '2025-10-07 13:00:08', NULL),
(41, 12, 'Người dùng 1 2', 'nguoi-dung-1-2', 'http://localhost/letranchinhnguyen-backend/public/products/nguoi-dung-1_thumbnail_20251007_130552.png', '<p>Người d&ugrave;ng 1</p>', 'Người dùng 1', 1241.00, 1, '2025-10-07 13:05:52', 1, '2025-10-10 10:14:35', 1),
(42, 11, 'ácmajcna', 'acmajcna', 'http://localhost/letranchinhnguyen-backend/public/products/acmajcna_thumbnail_20251010_123302.png', '<p>&aacute;cmajcna&nbsp;</p>', 'ácmajcna', 1234.00, 1, '2025-10-10 12:33:03', 1, '2025-10-10 12:33:03', NULL),
(43, 12, 'Áo sơ mi nam 1212ca', 'ao-so-mi-nam-1212ca', 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-1212ca_thumbnail_20251014_104001.png', '<p>&Aacute;o sơ mi nam 1212ca</p>', 'Áo sơ mi nam 1212ca', 1234.00, 1, '2025-10-14 10:40:01', 1, '2025-10-14 10:40:01', NULL),
(44, 10, 'zxasdcas', 'zxasdcas', 'http://localhost/letranchinhnguyen-backend/public/products/zxasdcas_thumbnail_20251014_105126.png', '<p>&nbsp;zxasdcas</p>', 'zxasdcas', 1234.00, 1, '2025-10-14 10:51:26', 1, '2025-10-14 10:51:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_product_attribute`
--

CREATE TABLE `ltcn_product_attribute` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_product_attribute`
--

INSERT INTO `ltcn_product_attribute` (`id`, `product_id`, `attribute_id`, `value`) VALUES
(4, 2, 1, 'Xanh'),
(5, 2, 2, 'XL'),
(6, 2, 3, 'Cotton'),
(7, 3, 1, 'Xanh'),
(8, 3, 2, 'M'),
(9, 3, 3, 'Polyester'),
(10, 4, 1, 'Đen'),
(11, 4, 2, 'S'),
(12, 4, 3, 'Jean'),
(13, 5, 1, 'Xanh'),
(14, 5, 2, 'L'),
(15, 5, 3, 'Da'),
(16, 6, 1, 'Đen'),
(17, 6, 2, 'XL'),
(18, 6, 3, 'Cotton'),
(19, 7, 1, 'Đỏ'),
(20, 7, 2, 'S'),
(21, 7, 3, 'Cotton'),
(22, 8, 1, 'Đỏ'),
(23, 8, 2, 'S'),
(24, 8, 3, 'Polyester'),
(25, 9, 1, 'Đen'),
(26, 9, 2, 'XL'),
(27, 9, 3, 'Jean'),
(28, 10, 1, 'Đỏ'),
(29, 10, 2, 'XL'),
(30, 10, 3, 'Jean'),
(31, 11, 1, 'Đen'),
(32, 11, 2, 'S'),
(33, 11, 3, 'Jean'),
(34, 12, 1, 'Đen'),
(35, 12, 2, 'S'),
(36, 12, 3, 'Jean'),
(51, 1, 1, 'Trắng'),
(52, 1, 2, 'XL'),
(53, 1, 3, 'Da'),
(56, 41, 4, 'C'),
(57, 41, 1, 'BV'),
(58, 42, 1, 'Đỏ'),
(59, 43, 1, 'Đỏ'),
(60, 43, 2, 'L'),
(61, 44, 1, 'Đỏ'),
(62, 44, 5, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_product_image`
--

CREATE TABLE `ltcn_product_image` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_product_image`
--

INSERT INTO `ltcn_product_image` (`id`, `product_id`, `image`, `alt`, `title`) VALUES
(1, 1, '/uploads/products/gallery/p1_1.jpg', 'Mặt trước', 'Front'),
(2, 1, '/uploads/products/detail/p1_2.jpg', 'Mặt sau', 'Back'),
(3, 1, '/uploads/products/zoom/p1_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(4, 1, '/uploads/products/variant/p1_4.jpg', 'Góc nghiêng', 'Side Angle'),
(5, 1, '/uploads/products/angle/p1_5.jpg', 'Phối cảnh', 'Styled Look'),
(6, 2, '/uploads/products/gallery/p2_1.jpg', 'Mặt trước', 'Front'),
(7, 2, '/uploads/products/detail/p2_2.jpg', 'Mặt sau', 'Back'),
(8, 2, '/uploads/products/zoom/p2_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(9, 2, '/uploads/products/variant/p2_4.jpg', 'Góc nghiêng', 'Side Angle'),
(10, 2, '/uploads/products/angle/p2_5.jpg', 'Phối cảnh', 'Styled Look'),
(11, 3, '/uploads/products/gallery/p3_1.jpg', 'Mặt trước', 'Front'),
(12, 3, '/uploads/products/detail/p3_2.jpg', 'Mặt sau', 'Back'),
(13, 3, '/uploads/products/zoom/p3_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(14, 3, '/uploads/products/variant/p3_4.jpg', 'Góc nghiêng', 'Side Angle'),
(15, 3, '/uploads/products/angle/p3_5.jpg', 'Phối cảnh', 'Styled Look'),
(16, 4, '/uploads/products/gallery/p4_1.jpg', 'Mặt trước', 'Front'),
(17, 4, '/uploads/products/detail/p4_2.jpg', 'Mặt sau', 'Back'),
(18, 4, '/uploads/products/zoom/p4_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(19, 4, '/uploads/products/variant/p4_4.jpg', 'Góc nghiêng', 'Side Angle'),
(20, 4, '/uploads/products/angle/p4_5.jpg', 'Phối cảnh', 'Styled Look'),
(21, 5, '/uploads/products/gallery/p5_1.jpg', 'Mặt trước', 'Front'),
(22, 5, '/uploads/products/detail/p5_2.jpg', 'Mặt sau', 'Back'),
(23, 5, '/uploads/products/zoom/p5_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(24, 5, '/uploads/products/variant/p5_4.jpg', 'Góc nghiêng', 'Side Angle'),
(25, 5, '/uploads/products/angle/p5_5.jpg', 'Phối cảnh', 'Styled Look'),
(26, 6, '/uploads/products/gallery/p6_1.jpg', 'Mặt trước', 'Front'),
(27, 6, '/uploads/products/detail/p6_2.jpg', 'Mặt sau', 'Back'),
(28, 6, '/uploads/products/zoom/p6_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(29, 6, '/uploads/products/variant/p6_4.jpg', 'Góc nghiêng', 'Side Angle'),
(30, 6, '/uploads/products/angle/p6_5.jpg', 'Phối cảnh', 'Styled Look'),
(31, 7, '/uploads/products/gallery/p7_1.jpg', 'Mặt trước', 'Front'),
(32, 7, '/uploads/products/detail/p7_2.jpg', 'Mặt sau', 'Back'),
(33, 7, '/uploads/products/zoom/p7_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(34, 7, '/uploads/products/variant/p7_4.jpg', 'Góc nghiêng', 'Side Angle'),
(35, 7, '/uploads/products/angle/p7_5.jpg', 'Phối cảnh', 'Styled Look'),
(36, 8, '/uploads/products/gallery/p8_1.jpg', 'Mặt trước', 'Front'),
(37, 8, '/uploads/products/detail/p8_2.jpg', 'Mặt sau', 'Back'),
(38, 8, '/uploads/products/zoom/p8_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(39, 8, '/uploads/products/variant/p8_4.jpg', 'Góc nghiêng', 'Side Angle'),
(40, 8, '/uploads/products/angle/p8_5.jpg', 'Phối cảnh', 'Styled Look'),
(41, 9, '/uploads/products/gallery/p9_1.jpg', 'Mặt trước', 'Front'),
(42, 9, '/uploads/products/detail/p9_2.jpg', 'Mặt sau', 'Back'),
(43, 9, '/uploads/products/zoom/p9_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(44, 9, '/uploads/products/variant/p9_4.jpg', 'Góc nghiêng', 'Side Angle'),
(45, 9, '/uploads/products/angle/p9_5.jpg', 'Phối cảnh', 'Styled Look'),
(46, 10, '/uploads/products/gallery/p10_1.jpg', 'Mặt trước', 'Front'),
(47, 10, '/uploads/products/detail/p10_2.jpg', 'Mặt sau', 'Back'),
(48, 10, '/uploads/products/zoom/p10_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(49, 10, '/uploads/products/variant/p10_4.jpg', 'Góc nghiêng', 'Side Angle'),
(50, 10, '/uploads/products/angle/p10_5.jpg', 'Phối cảnh', 'Styled Look'),
(51, 11, '/uploads/products/gallery/p11_1.jpg', 'Mặt trước', 'Front'),
(52, 11, '/uploads/products/detail/p11_2.jpg', 'Mặt sau', 'Back'),
(53, 11, '/uploads/products/zoom/p11_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(54, 11, '/uploads/products/variant/p11_4.jpg', 'Góc nghiêng', 'Side Angle'),
(55, 11, '/uploads/products/angle/p11_5.jpg', 'Phối cảnh', 'Styled Look'),
(56, 12, '/uploads/products/gallery/p12_1.jpg', 'Mặt trước', 'Front'),
(57, 12, '/uploads/products/detail/p12_2.jpg', 'Mặt sau', 'Back'),
(58, 12, '/uploads/products/zoom/p12_3.jpg', 'Cận chất liệu', 'Fabric Closeup'),
(59, 12, '/uploads/products/variant/p12_4.jpg', 'Góc nghiêng', 'Side Angle'),
(60, 12, '/uploads/products/angle/p12_5.jpg', 'Phối cảnh', 'Styled Look'),
(77, 31, 'http://localhost/letranchinhnguyen-backend/public/storage/uploads/images/2025/10/05/9Acp8khDsbWZXobVtrObKQanhATJYV7yx2Qe5Gcg.png', 'Áo sơ mi nam 1212', 'Áo sơ mi nam 1212'),
(78, 31, 'http://localhost/letranchinhnguyen-backend/public/storage/uploads/images/2025/10/05/vshOw8SymnujJ1NuUOXUpGGKrq553eAskWIHuuFg.png', 'Áo sơ mi nam 1212', 'Áo sơ mi nam 1212'),
(79, 31, 'http://localhost/letranchinhnguyen-backend/public/storage/uploads/images/2025/10/05/Yiql4DPDjuuXPsAaA6v9MFpLYGdiXJ5WcrlGh8I3.png', 'Áo sơ mi nam 1212', 'Áo sơ mi nam 1212'),
(80, 32, 'http://localhost/letranchinhnguyen-backend/public/storage/products/ao-so-mi-nam-12121_gallery_1_1759628357.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(81, 32, 'http://localhost/letranchinhnguyen-backend/public/storage/products/ao-so-mi-nam-12121_gallery_2_1759628357.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(82, 32, 'http://localhost/letranchinhnguyen-backend/public/storage/products/ao-so-mi-nam-12121_gallery_3_1759628357.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(83, 33, 'http://localhost/letranchinhnguyen-backend/public/products/test-123_gallery_1_20251005_014418.png', 'Test 123', 'Test 123'),
(84, 33, 'http://localhost/letranchinhnguyen-backend/public/products/test-123_gallery_2_20251005_014418.png', 'Test 123', 'Test 123'),
(85, 33, 'http://localhost/letranchinhnguyen-backend/public/products/test-123_gallery_3_20251005_014418.png', 'Test 123', 'Test 123'),
(86, 34, 'http://localhost/letranchinhnguyen-backend/public/products/products/ao-so-mi-nam-12121_gallery_1_20251007_062307.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(87, 34, 'http://localhost/letranchinhnguyen-backend/public/products/products/ao-so-mi-nam-12121_gallery_2_20251007_062307.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(88, 34, 'http://localhost/letranchinhnguyen-backend/public/products/products/ao-so-mi-nam-12121_gallery_3_20251007_062307.png', 'Áo sơ mi nam 12121', 'Áo sơ mi nam 12121'),
(89, 35, 'http://localhost/letranchinhnguyen-backend/public/products/test_gallery_1_20251007_062422.png', 'Test', 'Test'),
(90, 35, 'http://localhost/letranchinhnguyen-backend/public/products/test_gallery_2_20251007_062422.png', 'Test', 'Test'),
(91, 35, 'http://localhost/letranchinhnguyen-backend/public/products/test_gallery_3_20251007_062422.png', 'Test', 'Test'),
(92, 36, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121212131_gallery_1_20251007_125400.png', 'Áo sơ mi nam 121212131', 'Áo sơ mi nam 121212131'),
(93, 36, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121212131_gallery_2_20251007_125400.png', 'Áo sơ mi nam 121212131', 'Áo sơ mi nam 121212131'),
(94, 36, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121212131_gallery_3_20251007_125400.png', 'Áo sơ mi nam 121212131', 'Áo sơ mi nam 121212131'),
(95, 37, 'http://localhost/letranchinhnguyen-backend/public/products/testtest_gallery_1_20251007_125614.png', 'TestTest', 'TestTest'),
(96, 37, 'http://localhost/letranchinhnguyen-backend/public/products/testtest_gallery_2_20251007_125614.png', 'TestTest', 'TestTest'),
(97, 37, 'http://localhost/letranchinhnguyen-backend/public/products/testtest_gallery_3_20251007_125614.png', 'TestTest', 'TestTest'),
(98, 38, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121211_gallery_1_20251007_125851.png', 'Áo sơ mi nam 121211', 'Áo sơ mi nam 121211'),
(99, 38, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121211_gallery_2_20251007_125851.png', 'Áo sơ mi nam 121211', 'Áo sơ mi nam 121211'),
(100, 38, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-121211_gallery_3_20251007_125851.png', 'Áo sơ mi nam 121211', 'Áo sơ mi nam 121211'),
(101, 39, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-12121w1wqsaxs_gallery_1_20251007_130007.png', 'Áo sơ mi nam 12121w1wqsaxs', 'Áo sơ mi nam 12121w1wqsaxs'),
(102, 39, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-12121w1wqsaxs_gallery_2_20251007_130007.png', 'Áo sơ mi nam 12121w1wqsaxs', 'Áo sơ mi nam 12121w1wqsaxs'),
(103, 39, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-12121w1wqsaxs_gallery_3_20251007_130007.png', 'Áo sơ mi nam 12121w1wqsaxs', 'Áo sơ mi nam 12121w1wqsaxs'),
(107, 41, 'http://localhost/letranchinhnguyen-backend/public/products/nguoi-dung-1_gallery_1_20251007_130552.png', 'Người dùng 1', 'Người dùng 1'),
(108, 41, 'http://localhost/letranchinhnguyen-backend/public/products/nguoi-dung-1_gallery_2_20251007_130552.png', 'Người dùng 1', 'Người dùng 1'),
(109, 41, 'http://localhost/letranchinhnguyen-backend/public/products/nguoi-dung-1_gallery_3_20251007_130552.png', 'Người dùng 1', 'Người dùng 1'),
(110, 42, 'http://localhost/letranchinhnguyen-backend/public/products/acmajcna_gallery_1_20251010_123302.png', 'ácmajcna', 'ácmajcna'),
(111, 42, 'http://localhost/letranchinhnguyen-backend/public/products/acmajcna_gallery_2_20251010_123302.png', 'ácmajcna', 'ácmajcna'),
(112, 42, 'http://localhost/letranchinhnguyen-backend/public/products/acmajcna_gallery_3_20251010_123302.jpg', 'ácmajcna', 'ácmajcna'),
(113, 43, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-1212ca_gallery_1_20251014_104001.png', 'Áo sơ mi nam 1212ca', 'Áo sơ mi nam 1212ca'),
(114, 43, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-1212ca_gallery_2_20251014_104001.png', 'Áo sơ mi nam 1212ca', 'Áo sơ mi nam 1212ca'),
(115, 43, 'http://localhost/letranchinhnguyen-backend/public/products/ao-so-mi-nam-1212ca_gallery_3_20251014_104001.png', 'Áo sơ mi nam 1212ca', 'Áo sơ mi nam 1212ca'),
(116, 44, 'http://localhost/letranchinhnguyen-backend/public/products/zxasdcas_gallery_1_20251014_105126.png', 'zxasdcas', 'zxasdcas'),
(117, 44, 'http://localhost/letranchinhnguyen-backend/public/products/zxasdcas_gallery_2_20251014_105126.png', 'zxasdcas', 'zxasdcas'),
(118, 44, 'http://localhost/letranchinhnguyen-backend/public/products/zxasdcas_gallery_3_20251014_105126.png', 'zxasdcas', 'zxasdcas');

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_product_sale`
--

CREATE TABLE `ltcn_product_sale` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price_sale` double NOT NULL,
  `date_begin` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_product_sale`
--

INSERT INTO `ltcn_product_sale` (`id`, `name`, `product_id`, `price_sale`, `date_begin`, `date_end`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Khuyến mãi sản phẩm 1', 39, 43000, '2025-09-29 13:03:00', '2025-10-25 13:03:00', 1, '2025-09-10 07:03:54', 1, '2025-10-10 10:59:00', 1),
(2, 'Khuyến mãi sản phẩm 2', 2, 19000, '2025-09-02 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(3, 'Khuyến mãi sản phẩm 3', 3, 15000, '2025-09-02 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(4, 'Khuyến mãi sản phẩm 4', 4, 25000, '2025-09-03 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(5, 'Khuyến mãi sản phẩm 5', 5, 50000, '2025-09-07 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(6, 'Khuyến mãi sản phẩm 6', 6, 27000, '2025-09-03 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(7, 'Khuyến mãi sản phẩm 7', 7, 6000, '2025-09-05 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(8, 'Khuyến mãi sản phẩm 8', 8, 13000, '2025-09-05 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(9, 'Khuyến mãi sản phẩm 9', 9, 40000, '2025-09-04 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(10, 'Khuyến mãi sản phẩm 10', 10, 24000, '2025-09-09 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(11, 'Khuyến mãi sản phẩm 11', 11, 30000, '2025-09-08 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(12, 'Khuyến mãi sản phẩm 12', 12, 46000, '2025-09-02 07:03:54', '2025-09-30 07:03:54', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(13, 'Test', 12, 10000, '2025-10-09 11:59:00', '2025-10-11 11:59:00', 1, '2025-09-26 11:59:57', 1, '2025-09-26 11:59:57', NULL),
(14, 'TEst thêm', 42, 121, '2025-10-08 12:35:00', '2025-10-18 12:36:00', 1, '2025-10-10 12:36:11', 0, '2025-10-10 12:36:11', NULL),
(15, 'Khuyến mãi sản phẩm 11r1', 43, 123, '2025-10-06 10:40:00', '2025-10-15 10:40:00', 1, '2025-10-14 10:40:45', 0, '2025-10-14 10:40:45', NULL),
(16, 'Khuyến mãi cho Áo sơ mi nam 12121', 34, 123, '2025-10-13 11:38:00', '2025-10-17 11:38:00', 1, '2025-10-14 11:40:30', 16, '2025-10-14 11:40:30', NULL),
(17, 'Khuyến mãi cho zxasdcas', 36, 12, '2025-10-12 21:42:00', '2025-10-23 21:42:00', 1, '2025-10-14 11:42:37', 16, '2025-10-14 12:11:41', 16);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_product_store`
--

CREATE TABLE `ltcn_product_store` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(11) NOT NULL,
  `price_root` decimal(15,2) NOT NULL,
  `qty` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_product_store`
--

INSERT INTO `ltcn_product_store` (`id`, `product_id`, `price_root`, `qty`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 1, 140000.00, 45, 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 2, 65000.00, 66, 1, '2025-09-10 07:00:54', 1, NULL, NULL),
(3, 3, 153000.00, 44, 1, '2025-09-10 06:57:54', 1, NULL, NULL),
(4, 4, 97000.00, 50, 1, '2025-09-10 06:54:54', 1, NULL, NULL),
(5, 5, 198000.00, 25, 1, '2025-09-10 06:51:54', 1, NULL, NULL),
(6, 6, 142000.00, 15, 1, '2025-09-10 06:48:54', 1, NULL, NULL),
(7, 7, 182000.00, 89, 1, '2025-09-10 06:45:54', 1, NULL, NULL),
(8, 8, 137000.00, 10, 1, '2025-09-10 06:42:54', 1, NULL, NULL),
(9, 9, 153000.00, 75, 1, '2025-09-10 06:39:54', 1, NULL, NULL),
(10, 10, 65000.00, 23, 1, '2025-09-10 06:36:54', 1, NULL, NULL),
(11, 11, 91000.00, 23, 1, '2025-09-10 06:33:54', 1, NULL, NULL),
(12, 12, 147000.00, 37, 1, '2025-09-10 06:30:54', 1, NULL, NULL),
(13, 13, 123.00, 123, 1, '2025-09-13 14:38:27', 1, NULL, NULL),
(17, 10, 65000.00, 23, 1, '2025-09-10 06:36:54', 1, NULL, NULL),
(24, 31, 123.00, 111, 1, '2025-10-05 01:33:24', 1, '2025-10-05 01:33:24', NULL),
(25, 32, 123.00, 10, 1, '2025-10-05 01:39:17', 1, '2025-10-05 01:39:17', NULL),
(26, 33, 123.00, 122, 1, '2025-10-05 01:44:19', 1, '2025-10-05 01:44:19', NULL),
(27, 34, 123.00, 11, 1, '2025-10-07 06:23:08', 1, '2025-10-07 06:23:08', NULL),
(28, 35, 123.00, 111, 1, '2025-10-07 06:24:23', 1, '2025-10-07 06:24:23', NULL),
(29, 36, 123.00, 111, 1, '2025-10-07 12:54:01', 1, '2025-10-07 12:54:01', NULL),
(30, 37, 123.00, 1111, 1, '2025-10-07 12:56:14', 1, '2025-10-07 12:56:14', NULL),
(31, 38, 123.00, 1212, 1, '2025-10-07 12:58:51', 1, '2025-10-07 12:58:51', NULL),
(32, 39, 12.00, 1332, 1, '2025-10-07 13:00:08', 1, '2025-10-07 13:00:08', NULL),
(34, 41, 123.00, 1111, 1, '2025-10-07 13:05:52', 1, '2025-10-07 13:05:52', NULL),
(35, 42, 123.00, 1111, 1, '2025-10-10 12:33:03', 1, '2025-10-10 12:33:03', NULL),
(36, 42, 123.00, 1111, 1, '2025-10-10 12:34:12', 1, '2025-10-10 12:34:12', NULL),
(37, 43, 123.00, 123, 1, '2025-10-14 10:40:01', 1, '2025-10-14 10:40:01', NULL),
(38, 44, 123.00, 0, 1, '2025-10-14 10:51:26', 1, '2025-10-14 10:51:26', NULL),
(39, 43, 123.00, 111, 1, '2025-10-14 11:58:08', 16, '2025-10-14 11:58:08', NULL),
(40, 41, 123.00, 11111, 1, '2025-10-14 11:58:30', 16, '2025-10-14 11:58:30', NULL),
(41, 44, 123.00, 11111, 1, '2025-10-14 12:13:02', 16, '2025-10-14 12:13:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_setting`
--

CREATE TABLE `ltcn_setting` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_name` varchar(255) NOT NULL,
  `slogan` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `hotline` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `favicon` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_setting`
--

INSERT INTO `ltcn_setting` (`id`, `site_name`, `slogan`, `email`, `phone`, `hotline`, `address`, `logo`, `favicon`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'My E-Commerce Website 123123', 'Chất lượng tạo thương hiệu!', 'support@example.com', '0901234567', '1800-1234', '123 Đường ABC, Quận XYZ, TP.HCM', '/images/logo/logo.svg', '/uploads/settings/favicon.ico', '2025-09-10 07:03:54', 1, '2025-10-01 14:11:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_social`
--

CREATE TABLE `ltcn_social` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `social_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_social`
--

INSERT INTO `ltcn_social` (`id`, `title`, `social_id`, `username`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Facebook', 1, 'myshop.fb', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(2, 'Instagram', 2, 'myshop.ig', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(3, 'Twitter', 3, 'myshop.tw', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(4, 'YouTube', 4, 'myshop.yt', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(5, 'TikTok', 5, 'myshop.tt', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(6, 'LinkedIn', 6, 'myshop.ln', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(7, 'Pinterest', 7, 'myshop.pin', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(8, 'Zalo', 8, 'myshop.zalo', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(9, 'Telegram', 9, 'myshop.tg', 1, '2025-09-10 07:03:55', 1, NULL, NULL),
(10, 'WhatsApp', 10, 'myshop.wa', 1, '2025-09-10 07:03:55', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_social_icon`
--

CREATE TABLE `ltcn_social_icon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_social_icon`
--

INSERT INTO `ltcn_social_icon` (`id`, `name`, `link`, `icon`) VALUES
(1, 'Facebook', 'https://facebook.com/', 'fa-brands fa-facebook'),
(2, 'Instagram', 'https://instagram.com/', 'fa fa-instagram'),
(3, 'Twitter', 'https://twitter.com/', 'fa fa-twitter'),
(4, 'YouTube', 'https://youtube.com/', 'fa fa-youtube'),
(5, 'TikTok', 'https://tiktok.com/', 'fa fa-tiktok'),
(6, 'LinkedIn', 'https://linkedin.com/', 'fa fa-linkedin'),
(7, 'Pinterest', 'https://pinterest.com/', 'fa fa-pinterest'),
(8, 'Zalo', 'https://zalo.me/', 'fa fa-zalo'),
(9, 'Telegram', 'https://t.me/', 'fa fa-telegram'),
(10, 'WhatsApp', 'https://wa.me/', 'fa fa-whatsapp');

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_topic`
--

CREATE TABLE `ltcn_topic` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_topic`
--

INSERT INTO `ltcn_topic` (`id`, `name`, `slug`, `sort_order`, `description`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Tin tức', 'tin-tuc', 1, 'Các tin tức mới nhất về cửa hàng và sản phẩm', 1, '2025-09-10 07:03:54', 1, NULL, NULL),
(2, 'Hướng dẫn', 'huong-dan', 2, 'Các bài viết hướng dẫn sử dụng và chăm sóc sản phẩm', 1, '2025-09-10 07:01:54', 1, NULL, NULL),
(3, 'Xu hướng', 'xu-huong', 3, 'Cập nhật xu hướng thời trang hiện nay', 1, '2025-09-10 06:59:54', 1, NULL, NULL),
(4, 'Chính sách', 'chinh-sach', 4, 'Thông tin về chính sách bán hàng, đổi trả', 1, '2025-09-10 06:57:54', 1, NULL, NULL),
(5, 'Khuyến mãi', 'khuyen-mai', 5, 'Thông báo các chương trình ưu đãi, khuyến mãi', 1, '2025-09-10 06:55:54', 1, NULL, NULL),
(6, 'Bí quyết phối đồ', 'bi-quyet-phoi-do', 6, 'Gợi ý cách phối đồ đẹp và phù hợp', 1, '2025-09-10 06:53:54', 1, NULL, NULL),
(7, 'Sự kiện', 'su-kien', 7, 'Thông tin về sự kiện của cửa hàng', 1, '2025-09-10 06:51:54', 1, NULL, NULL),
(8, 'Đánh giá sản phẩm', 'danh-gia-san-pham', 8, 'Các bài review và đánh giá sản phẩm', 1, '2025-09-10 06:49:54', 1, NULL, NULL),
(9, 'Câu chuyện thương hiệu', 'cau-chuyen-thuong-hieu', 9, 'Giới thiệu về thương hiệu và hành trình phát triển', 1, '2025-09-10 06:47:54', 1, NULL, NULL),
(10, 'Tuyển dụng', 'tuyen-dung', 10, 'Tin tức tuyển dụng nhân sự mới', 1, '2025-09-10 06:45:54', 1, NULL, NULL),
(11, 'Test topic 123', 'test-topic-123', 1, '123', 1, '2025-09-23 13:12:41', 1, '2025-09-25 12:49:41', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ltcn_user`
--

CREATE TABLE `ltcn_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ltcn_user`
--

INSERT INTO `ltcn_user` (`id`, `name`, `email`, `phone`, `username`, `password`, `role`, `avatar`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Admin', 'admin@example.com', '0900000000', 'admin', '202cb962ac59075b964b07152d234b70', 'admin', '/uploads/users/admin.jpg', 1, '2025-09-10 07:03:52', 1, NULL, NULL),
(2, 'Người dùng 1', 'user1@example.com', '0900000001', 'user1', 'e10adc3949ba59abbe56e057f20f883e', 'admin', NULL, 1, '2025-09-10 07:02:52', 1, '2025-10-07 07:09:27', NULL),
(3, 'Người dùng 2', 'user2@example.com', '0900000002', 'user2', '$2y$12$8180eGLUL/U2VMHVSh9v8eUkR4UKfNIn3SefbdvluJ/CMK7svbtme', 'customer', NULL, 1, '2025-09-10 07:01:52', 1, NULL, NULL),
(4, 'Người dùng 3', 'user3@example.com', '0900000003', 'user3', '$2y$12$4zLERZ8NUwxRaz4Ux.7gTuG/s5pxkkl6oW6LFwTBLCqY8.T.MCetS', 'customer', NULL, 1, '2025-09-10 07:00:52', 1, NULL, NULL),
(5, 'Người dùng 4', 'user4@example.com', '0900000004', 'user4', '$2y$12$W.pJMpEErFJKNUXe2WXJAuPraLWHSOev8aUB4iKqWYmvrzmyckx9u', 'customer', NULL, 1, '2025-09-10 06:59:52', 1, NULL, NULL),
(6, 'Người dùng 5', 'user5@example.com', '0900000005', 'user5', '$2y$12$LFXQgISvxQfhasMxnIrnUuJhKuQVAyhRg8Ctz3LXY2c1QVEqnSREW', 'customer', NULL, 1, '2025-09-10 06:58:52', 1, NULL, NULL),
(7, 'Người dùng 6', 'user6@example.com', '0900000006', 'user6', '$2y$12$kXfDRdIvPSujKpwEIr1cMuaOeJlvyzSjqMQNGWjL.N1XX2xUK9oba', 'customer', NULL, 1, '2025-09-10 06:57:52', 1, NULL, NULL),
(8, 'Người dùng 7', 'user7@example.com', '0900000007', 'user7', '$2y$12$yGaHkn.U.cBQ2SQFICcKOuXWUU0gUWWpR9twQcNDQ2KajqpP/AImu', 'customer', NULL, 1, '2025-09-10 06:56:52', 1, NULL, NULL),
(9, 'Người dùng 8', 'user8@example.com', '0900000008', 'user8', '$2y$12$c6zrjNYpeanPzvBTp9l3/eT3icbXbuWT4rVW424RMZsSvYicasJ2q', 'customer', NULL, 1, '2025-09-10 06:55:52', 1, NULL, NULL),
(10, 'Người dùng 9', 'user9@example.com', '0900000009', 'user9', '$2y$12$7riswWCMnn4hNleH6YyGcOlSCRrlmOjHJmB3zClZt1iV102j26XKa', 'customer', NULL, 1, '2025-09-10 06:54:52', 1, NULL, NULL),
(13, 'Lê Nguyên', 'admin@nioo.io.vn1', '08490812051', 'lenguyen20051', '$2y$12$6Z7aN3PSNuz8HPzBNjv3gepYenkRczg5Ekon9jbyHxMviUYohwopC', 'customer', NULL, 1, '2025-10-03 11:18:40', 0, '2025-10-03 11:18:40', NULL),
(14, 'Lê Nguyên', 'admin@nioo.io.vn12', '084908120512', 'lenguyen200512', '$2y$12$VQw7s9AWPo7GrXXzL.W2VuWScUh0bq969Z9MfzhTc3eTQ3shaBd5i', 'customer', NULL, 1, '2025-10-03 11:19:17', 0, '2025-10-03 11:19:17', NULL),
(15, 'Lê Nguyên', 'admin@nioo.io.vn121', '0849081205121', 'lenguyen2005121', '$2y$12$Xv0GHaewn4BdPeiB/dUJn.oJltqEj8qZKm3w9rixMkqWnZxV08ivC', 'customer', NULL, 1, '2025-10-03 11:21:56', 0, '2025-10-03 11:21:56', NULL),
(16, 'Lê Nguyên', 'admin@nioo.io.vn', '0849081205', 'lenguyen2005', 'fc72f4eabeec6178bfd6b2fc3896c001', 'admin', NULL, 1, '2025-10-03 11:47:19', 0, '2025-10-15 04:41:26', 16),
(17, 'Demo test regi', 'try@nioo.io.vn', '0849081211', 'demo1224', '67272c8c9c083b2423dd788657547787', 'customer', NULL, 1, '2025-10-15 02:34:32', 0, '2025-10-15 02:35:07', NULL),
(18, 'Nguyên', 'ideological214@tiffincrane.com', '0123456789', 'nguyenle2005', 'dbcb2ca05d4db597dea4e12b543eeb47', 'customer', NULL, 1, '2025-10-15 03:14:06', 0, '2025-10-15 03:14:21', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ltcn_attribute`
--
ALTER TABLE `ltcn_attribute`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_banner`
--
ALTER TABLE `ltcn_banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_category`
--
ALTER TABLE `ltcn_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_contact`
--
ALTER TABLE `ltcn_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_menu`
--
ALTER TABLE `ltcn_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_migrations`
--
ALTER TABLE `ltcn_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_order`
--
ALTER TABLE `ltcn_order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_order_detail`
--
ALTER TABLE `ltcn_order_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_post`
--
ALTER TABLE `ltcn_post`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_product`
--
ALTER TABLE `ltcn_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_product_attribute`
--
ALTER TABLE `ltcn_product_attribute`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_product_image`
--
ALTER TABLE `ltcn_product_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_product_sale`
--
ALTER TABLE `ltcn_product_sale`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_product_store`
--
ALTER TABLE `ltcn_product_store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_setting`
--
ALTER TABLE `ltcn_setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_social`
--
ALTER TABLE `ltcn_social`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_social_icon`
--
ALTER TABLE `ltcn_social_icon`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_topic`
--
ALTER TABLE `ltcn_topic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ltcn_user`
--
ALTER TABLE `ltcn_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ltcn_attribute`
--
ALTER TABLE `ltcn_attribute`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ltcn_banner`
--
ALTER TABLE `ltcn_banner`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `ltcn_category`
--
ALTER TABLE `ltcn_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `ltcn_contact`
--
ALTER TABLE `ltcn_contact`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `ltcn_menu`
--
ALTER TABLE `ltcn_menu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `ltcn_migrations`
--
ALTER TABLE `ltcn_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `ltcn_order`
--
ALTER TABLE `ltcn_order`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `ltcn_order_detail`
--
ALTER TABLE `ltcn_order_detail`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `ltcn_post`
--
ALTER TABLE `ltcn_post`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `ltcn_product`
--
ALTER TABLE `ltcn_product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `ltcn_product_attribute`
--
ALTER TABLE `ltcn_product_attribute`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `ltcn_product_image`
--
ALTER TABLE `ltcn_product_image`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `ltcn_product_sale`
--
ALTER TABLE `ltcn_product_sale`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `ltcn_product_store`
--
ALTER TABLE `ltcn_product_store`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `ltcn_setting`
--
ALTER TABLE `ltcn_setting`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ltcn_social`
--
ALTER TABLE `ltcn_social`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ltcn_social_icon`
--
ALTER TABLE `ltcn_social_icon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ltcn_topic`
--
ALTER TABLE `ltcn_topic`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ltcn_user`
--
ALTER TABLE `ltcn_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
