'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // Presensi milik satu User
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // --- TAMBAHAN WAJIB AGAR DATA MUNCUL DI LAPORAN ---
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    buktiFoto: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // --------------------------------------------------
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};