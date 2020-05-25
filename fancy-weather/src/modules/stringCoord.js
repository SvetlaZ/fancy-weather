function stringCoord(num) {
  return `${Math.floor(num)}° ${Math.ceil((num - Math.floor(num)) * 60)}′`;
}

export default stringCoord;
