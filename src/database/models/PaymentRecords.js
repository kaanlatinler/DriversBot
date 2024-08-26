module.exports = (sequelize, DataTypes) => {
    const PaymentRecords = sequelize.define('PaymentRecords', {
      discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      Car: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Desc: {
        type: DataTypes.STRING,
        allowNull: false
      },
    });
  
    return PaymentRecords;
  };
  