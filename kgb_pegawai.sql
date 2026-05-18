-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 13, 2026 at 01:00 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bpkadumum`
--

-- --------------------------------------------------------

--
-- Table structure for table `kgb_pegawai`
--

CREATE TABLE `kgb_pegawai` (
  `id` int NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `golongan` varchar(20) DEFAULT NULL,
  `mkg` varchar(20) DEFAULT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `tahun_awal` date DEFAULT NULL,
  `tahun_akhir` date DEFAULT NULL,
  `gaji` varchar(50) DEFAULT NULL,
  `unit` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kgb_pegawai`
--

INSERT INTO `kgb_pegawai` (`id`, `nip`, `nama`, `golongan`, `mkg`, `jabatan`, `tahun_awal`, `tahun_akhir`, `gaji`, `unit`) VALUES
(1, '196812091988031004', 'H. ANANTA FATHURROZI, S.Sos, M.Si', 'IV/c', '33 Thn', 'Kepala Badan', '2017-04-01', '2021-04-01', '5.866.400', 'Sekretariat'),
(2, '197501182007011016', 'Zuheryansyah, SE.', 'IV/b', '26 Thn', '-', '2025-04-01', '2027-04-01', '5.128.300', 'Sekretariat'),
(3, '198003122007012007', 'Asmiranda Martina, SE., M.Si.', 'III/d', '18 Thn', 'Kasubbag Umum & Kepegawaian', '2025-05-01', '2027-05-01', '4.169.900', 'Sekretariat'),
(4, '197504012001122004', 'Margaretha Theresiana, SE,MH', 'III/d', '09 Thn', 'Analis Keuangan Pusat dan Daerah Ahli Muda', '2023-12-01', '2025-12-01', '3.571.000', 'Sekretariat'),
(5, '197409131999032006', 'Suhartanty Rindrasari IK, SPt.', 'III/d', '26 Thn', 'Pengolah Data', '2025-03-01', '2027-03-01', '4.720.500', 'Sekretariat'),
(6, '197108062008011021', 'Muhammad Yusuf', 'II/c', '23 Thn', 'Pengadministrasi Perkantoran', '2026-04-01', '2028-04-01', '3.389.700', 'Sekretariat'),
(7, '198005022009012002', 'Feriany Selvy', 'III/a', '21 Thn', 'Pengadministrasi Perkantoran', '2025-04-01', '2027-04-01', '3.798.500', 'Sekretariat'),
(8, '198107052010011001', 'Ali Musthofa', 'II/d', '19 Thn', 'Pengadministrasi Perkantoran', '2024-08-01', '2026-08-01', '3.320.600', 'Sekretariat'),
(9, '197707271996032002', 'Wahidah', 'III/b', '24 Thn', 'Pengadministrasi Perkantoran', '2025-03-01', '2027-03-01', '4.212.500', 'Sekretariat'),
(10, '198508132010011011', 'Muhammad Fahmi,SE', 'II/d', '21 Thn', 'Pengadministrasi Perkantoran', '2024-08-01', '2026-08-01', '3.425.200', 'Sekretariat'),
(11, '199909222025062014', 'Fauziah Ayu Yulianti S.Kom', 'III/a', '01 Thn', 'Penata Kelola Sistem dan Teknologi', '2025-06-01', '2027-06-01', '2.785.700', 'Sekretariat'),
(12, '198301282009012001', 'Nita Rahma Wati,S.Sos', 'III/a', '23 Thn', 'Pengolah Data dan Informasi', '2025-04-01', '2027-04-01', '3.918.100', 'Sekretariat'),
(13, '197007162010011001', 'Jamrahadi, SE', 'III/b', '17 Thn', 'Pengolah Data dan Informasi', '2023-10-01', '2025-10-01', '3.721.100', 'Sekretariat'),
(14, '200201032023022001', 'Putu Nadia Paramitha Sukmahadi, A.Md.Ak.', 'II/c', '05 Thn', 'Pengolah Data dan Informasi', '2025-02-01', '2027-02-01', '2.564.200', 'Sekretariat'),
(15, '200212222024092001', 'Nur Aulia, A.S.Tr.I.P', 'III/a', '01 Thn', 'Fasilitator Pemerintahan', '2024-09-01', '2026-09-01', '2.785.700', 'Sekretariat'),
(16, '197108241992031007', 'H. Yusdiansyah, S.Sos., MM.', 'IV/a', '28 Thn', 'Kepala Bidang Aset', '2025-03-01', '2027-03-01', '5.075.200', 'Bidang Aset'),
(17, '198110192007011009', 'Deny Wardana, SE.', 'III/d', '19 Thn', 'Kepala Sub Bidang Aset 1', '2024-03-01', '2026-03-01', '4.169.900', 'Bidang Aset'),
(18, '198710082007012001', 'Rosita Kusuma Sari, S.IP., M.Si.', 'IV/a', '14 Thn', 'Kepala Sub Bidang Aset 2', '2023-10-01', '2025-10-01', '4.084.900', 'Bidang Aset'),
(19, '197210122007011016', 'Hendra', 'II/d', '25 Thn', 'Pengadministrasi Perkantoran', '2025-05-01', '2027-05-01', '3.644.300', 'Bidang Aset'),
(20, '198210282010012022', 'Novita Ervina', 'II/d', '21 Thn', 'Pengadministrasi Perkantoran', '2024-09-01', '2026-09-01', '3.425.200', 'Bidang Aset'),
(21, '198209162008011011', 'Dendy Miranda Aswar, S.Sos. M.Si', 'III/d', '14 Thn', 'Pengolah Data dan Informasi', '2024-06-01', '2026-06-01', '3.919.100', 'Bidang Aset'),
(22, '197607262003121005', 'Muhammad Asyiri, A.Md', 'III/b', '15 Thn', 'Pengolah Data dan Informasi', '2024-12-01', '2026-12-01', '3.607.500', 'Bidang Aset'),
(23, '197610112007011012', 'Wahyudi', 'III/a', '22 Thn', 'Pengadministrasi Perkantoran', '2025-07-01', '2027-07-01', '3.918.100', 'Bidang Aset'),
(24, '198310282008011010', 'Kamaluddin', 'III/a', '18 Thn', 'Operator Layanan Operasional', '2025-06-01', '2027-06-01', '3.682.500', 'Bidang Aset'),
(25, '198401182005021002', 'Dimadz Ravindra Saleh', 'III/b', '16 Thn', 'Operator Layanan Operasional', '2026-02-01', '2028-02-01', '3.721.100', 'Bidang Aset'),
(26, '197711262007011018', 'Herlambang', 'III/a', '18 Thn', 'Pengadministrasi Perkantoran', '2025-01-01', '2027-01-01', '3.682.500', 'Bidang Aset'),
(27, '197505062007011014', 'Supriyono', 'III/a', '18 Thn', 'Operator Layanan Operasional', '2025-07-01', '2027-07-01', '3.682.500', 'Bidang Aset'),
(28, '198109252008012025', 'Mina, SE', 'III/d', '18 Thn', 'Pengolah Data dan Informasi', '2025-05-01', '2027-05-01', '4.169.900', 'Bidang Aset'),
(29, '198406262009012002', 'Syelvia Ramadani, SE', 'III/d', '17 Thn', 'Penelaah Teknis Kebijakan', '2024-08-01', '2026-08-01', '4.042.500', 'Bidang Aset'),
(30, '197912142001121005', 'Muhammad Faisyal Riza, SE.', 'III/d', '12 Thn', 'Penelaah Teknis Kebijakan', '2024-10-01', '2026-10-01', '3.799.400', 'Bidang Aset'),
(31, '198203182005021003', 'Sungkono', 'III/a', '17 Thn', 'Pengadministrasi Perkantoran', '2025-02-01', '2027-02-01', '3.570.100', 'Bidang Aset'),
(32, '198406172010011018', 'Muhammad Alfian Nur,SE', 'III/a', '17 Thn', 'Pengadministrasi Perkantoran', '2024-08-01', '2026-08-01', '3.570.100', 'Bidang Aset'),
(33, '197003171993081002', 'H. Aidi Fadli, SE.M.Si', 'IV/a', '22 Thn', 'Kepala Bidang Perbendaharaan', '2024-03-01', '2026-03-01', '4.624.300', 'Bidang Perbendaharaan'),
(34, '197303082001122002', 'Sri Hartati Utami, SE. MM.', 'IV/a', '28 Thn', '-', '2026-05-01', '2028-05-01', '5.075.200', 'Bidang Perbendaharaan'),
(35, '197012301990022002', 'Nur Laila Fitriana, SE', 'III/d', '28 Thn', 'Perencana Muda (Penyetaraan)', '2025-02-01', '2027-02-01', '4.869.200', 'Bidang Perbendaharaan'),
(36, '198805152015032001', 'Andi Rezky Fitriana Fitermen, SE., Ak.', 'III/d', '12 Thn', 'Analis Keuangan Pusat dan Daerah Ahli Muda', '2025-09-01', '2027-09-01', '3.799.400', 'Bidang Perbendaharaan'),
(37, '197008112002121006', 'Ahmadiansyah, S.Kom', 'III/d', '28 Thn', 'Penelaah Teknis Kebijakan', '2026-02-01', '2028-02-01', '4.869.200', 'Bidang Perbendaharaan'),
(38, '198007032015032001', 'Benedikta Fransiska yulianti, SE.', 'III/c', '10 Thn', 'Penelaah Teknis Kebijakan', '2025-03-01', '2027-03-01', '3.533.900', 'Bidang Perbendaharaan'),
(39, '196905011994032010', 'Hj. Sitti Sundari AP.', 'III/b', '26 Thn', 'Pengadministrasi Perkantoran', '2025-03-01', '2027-03-01', '4.345.100', 'Bidang Perbendaharaan'),
(40, '197112282002122006', 'Ertati', 'III/b', '13 Thn', 'Pengadministrasi Perkantoran', '2024-10-01', '2026-10-01', '3.497.300', 'Bidang Perbendaharaan'),
(41, '197511252007011011', 'E.M. Arif Fadilah, SE.', 'III/c', '22 Thn', 'Penelaah Teknis Kebijakan', '2026-04-01', '2028-04-01', '4.256.600', 'Bidang Perbendaharaan'),
(42, '196809252008012012', 'Nurlaila', 'III/a', '18 Thn', 'Pengadministrasi Perkantoran', '2025-06-01', '2027-06-01', '3.682.500', 'Bidang Perbendaharaan'),
(43, '200005212023021001', 'Luthfi Baidlowi, A.Md.Kb.N.', 'II/c', '05 Thn', 'Pengolah Data dan Informasi', '2025-02-01', '2027-02-01', '2.564.200', 'Bidang Perbendaharaan'),
(44, '198502222010011001', 'Muhammad Ikhsan, SE. MM.', 'III/d', '17 Thn', 'Penelaah Teknis Kebijakan', '2024-09-01', '2026-09-01', '4.042.500', 'Bidang Perbendaharaan'),
(45, '200106122023021003', 'Bayuan Bangre Tangkesalu, A.Md.Kb.N.', 'II/c', '05 Thn', 'Pengolah Data dan Informasi', '2025-02-01', '2027-02-01', '2.564.200', 'Bidang Perbendaharaan'),
(46, '197703082008012021', 'Martha Yurlati, SE.', 'III/d', '17 Thn', 'Penelaah Teknis Kebijakan', '2024-09-01', '2026-09-01', '4.042.500', 'Bidang Perbendaharaan'),
(47, '198208052011012003', 'Rita Damayanty, SE.Ak.M.Ak', 'IV/a', '15 Thn', 'Kepala Bidang Akuntansi', '2025-01-01', '2027-01-01', '4.084.900', 'Bidang Akuntansi'),
(48, '197505062005022002', 'Shiska Meliana, SE', 'III/d', '20 Thn', '-', '2025-02-01', '2027-02-01', '4.301.200', 'Bidang Akuntansi'),
(49, '197107172007012014', 'Hj. Yulistiawati, SE., M.Si', 'III/d', '20 Thn', 'Penilai Pemerintahan Ahli Muda', '2025-05-01', '2027-05-01', '4.301.200', 'Bidang Akuntansi'),
(50, '197306231994032006', 'Nurfitria Arisanti, SE.MM.', 'IV/a', '20 Thn', 'Analis Keuangan Pusat dan Daerah Ahli Muda', '2024-03-01', '2026-03-01', '4.483.100', 'Bidang Akuntansi'),
(51, '197207081997032004', 'Rita Sri Siswandari, A.Md.', 'III/c', '26 Thn', 'Pengolah Data dan Informasi', '2025-03-01', '2027-03-01', '4.528.900', 'Bidang Akuntansi'),
(52, '198601222010012001', 'Andi Haerani,SE', 'III/a', '16 Thn', 'Pengadministrasi Perkantoran', '2025-07-01', '2027-07-01', '3.570.100', 'Bidang Akuntansi'),
(53, '200106252023021004', 'Muhammad Ghazalli Rahman Farissi, A.Md. Ak', 'II/c', '05 Thn', 'Pengolah Data dan Informasi', '2025-02-01', '2027-02-01', '2.564.200', 'Bidang Akuntansi'),
(54, '198008122015032001', 'Rina Melati Sitanggang, SE.', 'III/c', '10 Thn', 'Penelaah Teknis Kebijakan', '2025-03-01', '2027-03-01', '3.533.900', 'Bidang Akuntansi'),
(55, '198709162015031003', 'Budi, S.S.T.', 'III/c', '10 Thn', 'Penelaah Teknis Kebijakan', '2025-03-01', '2027-03-01', '3.533.900', 'Bidang Akuntansi'),
(56, '198503312010011019', 'Fachrizal, A.Md', 'III/b', '11 Thn', 'Pengolah Data dan Informasi', '2024-01-01', '2026-01-01', '3.390.500', 'Bidang Akuntansi'),
(57, '198407022010012001', 'Arifah Ashari,S.Ak', 'III/a', '17 Thn', 'Pengadministrasi Perkantoran', '2024-10-01', '2026-10-01', '3.570.100', 'Bidang Akuntansi'),
(58, '197202192007011013', 'H.A. Rama Gagaryn, SE, MM.', 'IV/a', '24 Thn', '-', '2025-06-01', '2027-06-01', '4.770.000', 'Bidang Anggaran'),
(59, '197406112008011019', 'Surya Darma,SE.,M.Si', 'IV/a', '24 Thn', '-', '2026-04-01', '2028-04-01', '4.770.000', 'Bidang Anggaran'),
(60, '197707152008011022', 'Silvanus Marantika, SE, MM.', 'IV/a', '24 Thn', '-', '2026-05-01', '2028-05-01', '4.770.000', 'Bidang Anggaran'),
(61, '197503012000031005', 'Mulyawan,S.M', 'III/c', '22 Thn', 'Pengolah Data dan Informasi', '2025-09-01', '2027-09-01', '4.256.600', 'Bidang Anggaran'),
(62, '197103182006041023', 'Adji Khrisna Hidayat, A.Md', 'III/c', '19 Thn', 'Pengolah Data dan Informasi', '2025-09-01', '2027-09-01', '4.000.600', 'Bidang Anggaran'),
(63, '197411032010011001', 'Aidin Subihartanto Hadi, A.Md.S.M', 'III/b', '20 Thn', 'Pengolah Data dan Informasi', '2026-04-01', '2028-04-01', '3.959.200', 'Bidang Anggaran'),
(64, '198105132007011011', 'Edy Susanto', 'III/a', '16 Thn', 'Pengadministrasi Perkantoran', '2024-09-01', '2026-09-01', '3.570.100', 'Bidang Anggaran'),
(65, '197709302008012018', 'Devy Septiani, SE.', 'III/d', '24 Thn', 'Penelaah Teknis Kebijakan', '2026-04-01', '2028-04-01', '4.576.400', 'Bidang Anggaran'),
(66, '197712282007012012', 'Rina Ekawati, SE, M.Si.', 'IV/a', '24 Thn', 'Penelaah Teknis Kebijakan', '2025-02-01', '2027-02-01', '4.770.000', 'Bidang Anggaran'),
(67, '198109112010012003', 'Rusdiana, A.Md.', 'III/b', '18 Thn', 'Pengolah Data dan Informasi', '2025-08-01', '2027-08-01', '3.838.300', 'Bidang Anggaran');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kgb_pegawai`
--
ALTER TABLE `kgb_pegawai`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kgb_pegawai`
--
ALTER TABLE `kgb_pegawai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
