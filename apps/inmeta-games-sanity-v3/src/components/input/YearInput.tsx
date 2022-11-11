import { Flex, Select } from "@sanity/ui";
import React from "react";
import { NumberInputProps, PatchEvent, set } from "sanity";

type Props = NumberInputProps & {};

const startYear = 2020;
const numOfYears = 50;

const YearInput = (props: Props) => {
  console.log({ props });

  const options = [...Array(numOfYears).keys()].map(num => startYear + num);

  return (
    <Flex direction="row" align="center">
      <Select
        defaultValue={startYear}
        value={props.value}
        onChange={event =>
          props.onChange(
            PatchEvent.from(set(Number(event.currentTarget.value)))
          )
        }
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default YearInput;
