module.exports = (sequelize, DataTypes) => {
    const UserRecords = sequelize.define('UserRecords', {
      discord_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      LoginHour: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
      LogoutHour: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
      TotalHours: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
    });
  
    return UserRecords;
  };
  