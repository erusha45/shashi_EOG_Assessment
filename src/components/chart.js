import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import moment from 'moment';

const randomColor = () => {
  var color = Math.floor(Math.random() * 16777216).toString(16);
  return '#000000'.slice(0, -color.length) + color;
};

export default function Chart(props) {
  const mergedObjects = [];

  if (!props.measurements || !props.measurements.length)
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Choose one or more metrics.</h1>
      </div>
    );

  _.forEach(props.measurements[0].measurements, function(item, index) {
    const measurements = _.map(props.measurements, 'measurements');

    let mergedItem = {};

    _.forEach(measurements, function(value) {
      mergedItem = {
        ...mergedItem,
        ...value[index],
        [value[index].metric]: value[index].value,
        atValue: moment(value[index].at).format('LT'),
      };
    });

    mergedObjects.push(mergedItem);
  });

  const finalData = _.sortBy(mergedObjects, ['at']).filter(m => m.value >= 0);

  return (
    <LineChart width={1100} height={500} data={finalData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="atValue" />
      {props.measurements.map((d, i) => (
        <YAxis yAxisId={i} key={i} />
      ))}
      <Tooltip />
      <Legend />
      {props.measurements.map((d, i) => (
        <Line yAxisId={i} key={i} type="monotone" dataKey={d.metric} dot={false} stroke={randomColor()} />
      ))}
    </LineChart>
  );
}
