import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
const LocationStats = ({stats})=>{
    const cityCount = stats.reduce((acc,item)=>{
        if(acc[item.city]){
            acc[item.city]+=1;
        }
        else{
            acc[item.city]=1;
        }
        return acc
    },{})
    return<div>
        <ResponsiveContainer>
        <LineChart
      width={500}
      height={300}
      data={cityCount}
      
    >  
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="city" padding={{ left: 20, right: 20 }} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
    </ResponsiveContainer>
    </div>
}
export default LocationStats;