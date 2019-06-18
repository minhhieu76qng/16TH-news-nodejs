-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2019 at 06:48 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vn_news`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_type`
--

CREATE TABLE `account_type` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account_type`
--

INSERT INTO `account_type` (`id`, `type`, `display_name`) VALUES
(1, 'ADMIN', 'Quản trị viên'),
(2, 'EDITOR', 'Biên tập viên'),
(3, 'WRITER', 'Phóng viên'),
(4, 'SUBSCRIBER', 'Độc giả');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `cat_name` varchar(50) NOT NULL,
  `parent_cat` int(11) DEFAULT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0' COMMENT '0: false : chưa xóa | 1:true đã xóa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cat_name`, `parent_cat`, `is_deleted`) VALUES
(1, 'Giáo dục', NULL, 0),
(2, 'Thể thao', NULL, 0),
(3, 'Công nghệ', NULL, 0),
(4, 'Giải trí', NULL, 0),
(5, 'Sức khỏe', NULL, 0),
(6, 'Tin tuyển sinh', 1, 0),
(7, 'Khuyến học', 1, 0),
(8, 'Du học', 1, 0),
(9, 'Bóng đá', 2, 0),
(10, 'Thể thao ngoài nước', 2, 0),
(11, 'Thể thao trong nước', 2, 0),
(12, 'Xem - Ăn - Chơi', 4, 0),
(13, 'Thời trang', 4, 0),
(14, 'Sao Việt', 4, 0),
(15, 'Kiến thức giới tính', 5, 0),
(16, 'Làm đẹp', 5, 0),
(17, 'Tin tức công nghệ', 3, 0),
(18, 'Review sản phẩm', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `date_submit` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `date_created` datetime NOT NULL,
  `cover_image` varchar(200) NOT NULL,
  `abstract` varchar(2000) NOT NULL,
  `content` text NOT NULL,
  `id_writer` int(11) NOT NULL,
  `id_status` int(11) NOT NULL COMMENT 'tình trạng bài viết: được accept hay ....',
  `id_category` int(11) NOT NULL,
  `type_post` int(11) NOT NULL COMMENT '1: premium, 0: bình thường',
  `views` bigint(255) UNSIGNED NOT NULL,
  `download_link` varchar(200) DEFAULT NULL,
  `date_posted` datetime DEFAULT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `post_action`
--

CREATE TABLE `post_action` (
  `id` int(255) NOT NULL,
  `id_post` int(255) NOT NULL,
  `id_status` int(255) NOT NULL,
  `id_user` int(255) NOT NULL,
  `date_modified` datetime NOT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `post_status`
--

CREATE TABLE `post_status` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL COMMENT 'chưa duyệt, đã duyệt, bị từ chối, đã đăng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `post_status`
--

INSERT INTO `post_status` (`id`, `status_name`) VALUES
(1, 'Chờ xuất bản'),
(2, 'Đã xuất bản'),
(3, 'Bị từ chối'),
(4, 'Chưa được duyệt');

-- --------------------------------------------------------

--
-- Table structure for table `post_tag`
--

CREATE TABLE `post_tag` (
  `id` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `tag_name` varchar(50) NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(120) NOT NULL,
  `exp_date` date DEFAULT NULL,
  `pseudonym` varchar(100) DEFAULT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `dob`, `email`, `password`, `exp_date`, `pseudonym`, `is_deleted`) VALUES
(14, 'admin', '2019-06-18', 'admin@admin.com', '$2b$10$TJRRDju2cXwXACWT1m17r.Mbzxc3qyhZWfnyh8ueH1GoqZBCnh1vS', NULL, NULL, 0),
(15, 'writer', '2019-06-18', 'writer@writer.com', '$2b$10$NsX3uLp4/dfGhtBaeP1gG.r9KfwJNkG93sVVOhjrdGIDBoeoscVyq', NULL, NULL, 0),
(16, 'editor', '2019-06-18', 'editor@editor.com', '$2b$10$lF2w8klm2M.Z.izryjz90u9jnl9rZTpd3xUfTb0jnSMJAgy0ONOzu', NULL, NULL, 0),
(17, 'editor2', '2006-06-22', 'editor2@editor.com', '$2b$10$YExJD979gErLGbEpu2sHEObk9zfmQGVOkntOkzh91RxpRQiWiYDxi', NULL, NULL, 0),
(18, 'editor3', '2019-06-13', 'editor3@editor.com', '$2b$10$X9KVFUv88FSm/AtOeGnwNuD1uTUL5D6kxe.lvK3HnjUDE/gT4SkFK', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_account_type`
--

CREATE TABLE `user_account_type` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_account_type` int(11) NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_account_type`
--

INSERT INTO `user_account_type` (`id`, `id_user`, `id_account_type`, `is_deleted`) VALUES
(13, 14, 1, 0),
(14, 15, 3, 0),
(15, 16, 2, 0),
(16, 17, 2, 0),
(17, 18, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_category`
--

CREATE TABLE `user_category` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_category`
--

INSERT INTO `user_category` (`id`, `id_user`, `id_category`) VALUES
(1, 16, 9),
(2, 16, 16),
(3, 16, 14),
(9, 17, 9),
(10, 17, 10),
(11, 17, 11),
(18, 18, 6),
(19, 18, 7),
(20, 18, 18),
(21, 18, 9),
(22, 18, 17),
(23, 18, 8);

-- --------------------------------------------------------

--
-- Table structure for table `view_weeks`
--

CREATE TABLE `view_weeks` (
  `id` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `week` date NOT NULL,
  `views_in_week` bigint(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_type`
--
ALTER TABLE `account_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foreign_key_parent_cat` (`parent_cat`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foreign_id_id_post` (`id_post`),
  ADD KEY `fk_foreign_key_id_id_user` (`id_user`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foreign_key_id_id_category` (`id_category`),
  ADD KEY `fk_foreign_key_id_id_status` (`id_status`),
  ADD KEY `fk_foreign_key_id_id_writer` (`id_writer`);
ALTER TABLE `post` ADD FULLTEXT KEY `title` (`title`);
ALTER TABLE `post` ADD FULLTEXT KEY `content` (`content`);
ALTER TABLE `post` ADD FULLTEXT KEY `abstract` (`abstract`);

--
-- Indexes for table `post_action`
--
ALTER TABLE `post_action`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_status`
--
ALTER TABLE `post_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_tag`
--
ALTER TABLE `post_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foreign_key_id_id_post` (`id_post`),
  ADD KEY `fk_foreign_key_id_id_tag` (`id_tag`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_account_type`
--
ALTER TABLE `user_account_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_category`
--
ALTER TABLE `user_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_foreign_key_id_category_user_category` (`id_category`),
  ADD KEY `fk_foreign_key_id_user_user_category` (`id_user`);

--
-- Indexes for table `view_weeks`
--
ALTER TABLE `view_weeks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_type`
--
ALTER TABLE `account_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `post_action`
--
ALTER TABLE `post_action`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_status`
--
ALTER TABLE `post_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `post_tag`
--
ALTER TABLE `post_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_account_type`
--
ALTER TABLE `user_account_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `user_category`
--
ALTER TABLE `user_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `view_weeks`
--
ALTER TABLE `view_weeks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_foreign_key_parent_cat` FOREIGN KEY (`parent_cat`) REFERENCES `category` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `fk_foreign_id_id_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `fk_foreign_key_id_id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_foreign_key_id_id_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `fk_foreign_key_id_id_status` FOREIGN KEY (`id_status`) REFERENCES `post_status` (`id`),
  ADD CONSTRAINT `fk_foreign_key_id_id_writer` FOREIGN KEY (`id_writer`) REFERENCES `user` (`id`);

--
-- Constraints for table `post_tag`
--
ALTER TABLE `post_tag`
  ADD CONSTRAINT `fk_foreign_key_id_id_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `fk_foreign_key_id_id_tag` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id`);

--
-- Constraints for table `user_category`
--
ALTER TABLE `user_category`
  ADD CONSTRAINT `fk_foreign_key_id_category_user_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `fk_foreign_key_id_user_user_category` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
