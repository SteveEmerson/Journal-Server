/* Model for the Journal table */
// id ... string ... null = false
// title ... string ... null = false
// date ... string ... null = false
// entry ... string

module.exports = function(sequelize, DataTypes){
  const Journal = sequelize.define('journal', {
    owner: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entry:{
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Journal;
};

