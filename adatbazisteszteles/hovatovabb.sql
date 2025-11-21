--
-- Database: `hovatovabb`
--
CREATE DATABASE `hovatovabb`;
USE `hovatovabb_test`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `felhasznalonev` varchar(50) NOT NULL,
  `jelszo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `felhasznalonev` varchar(50) NOT NULL,
  `jelszo` varchar(100) NOT NULL,
  `teljes_nev` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `kedv_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jarat`
--

CREATE TABLE `jarat` (
  `id` int(11) NOT NULL,
  `ind_allomas` varchar(100) NOT NULL,
  `erk_allomas` varchar(100) NOT NULL,
  `ind_ido` datetime NOT NULL,
  `erk_ido` datetime NOT NULL,
  `jegyar` int(11) DEFAULT NULL,
  `jarmu_id` int(11) NOT NULL,
  `ido` time DEFAULT NULL,
  `km` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jarmu`
--

CREATE TABLE `jarmu` (
  `id` int(11) NOT NULL,
  `tipus` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kedvezmenyek`
--

CREATE TABLE `kedvezmenyek` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `szazalek` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tervek`
--

CREATE TABLE `tervek` (
  `id` int(11) NOT NULL,
  `felhasznalonev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terv_jarat`
--

CREATE TABLE `terv_jarat` (
  `terv_id` int(11) NOT NULL,
  `jarat_id` int(11) NOT NULL,
  `sorrend` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`felhasznalonev`);

--
-- Indexes for table `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalonev`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_felhasznalo_kedvezmeny` (`kedv_id`),
  ADD KEY `email_2` (`email`);

--
-- Indexes for table `jarat`
--
ALTER TABLE `jarat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jarmu_id` (`jarmu_id`);

--
-- Indexes for table `jarmu`
--
ALTER TABLE `jarmu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kedvezmenyek`
--
ALTER TABLE `kedvezmenyek`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tervek`
--
ALTER TABLE `tervek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalonev` (`felhasznalonev`);

--
-- Indexes for table `terv_jarat`
--
ALTER TABLE `terv_jarat`
  ADD PRIMARY KEY (`terv_id`,`jarat_id`),
  ADD KEY `jarat_id` (`jarat_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jarat`
--
ALTER TABLE `jarat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jarmu`
--
ALTER TABLE `jarmu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `kedvezmenyek`
--
ALTER TABLE `kedvezmenyek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tervek`
--
ALTER TABLE `tervek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD CONSTRAINT `fk_felhasznalo_kedvezmeny` FOREIGN KEY (`kedv_id`) REFERENCES `kedvezmenyek` (`id`);

--
-- Constraints for table `jarat`
--
ALTER TABLE `jarat`
  ADD CONSTRAINT `jarat_ibfk_1` FOREIGN KEY (`jarmu_id`) REFERENCES `jarmu` (`id`);

--
-- Constraints for table `tervek`
--
ALTER TABLE `tervek`
  ADD CONSTRAINT `tervek_ibfk_1` FOREIGN KEY (`felhasznalonev`) REFERENCES `felhasznalo` (`felhasznalonev`);

--
-- Constraints for table `terv_jarat`
--
ALTER TABLE `terv_jarat`
  ADD CONSTRAINT `terv_jarat_ibfk_1` FOREIGN KEY (`terv_id`) REFERENCES `tervek` (`id`),
  ADD CONSTRAINT `terv_jarat_ibfk_2` FOREIGN KEY (`jarat_id`) REFERENCES `jarat` (`id`);
COMMIT;
