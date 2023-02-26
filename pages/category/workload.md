# Workloads

As an expansion of the gem5-resources infrastructure, the concept of a `Workload` has been introduced. The gem5-resources infrastructure has, for several major releases, provides resources. As an example:

```python
from gem5.resources.resource import Resource

image = Resource("x86-npb")
kernel = Resource("x86-linux-kernel-5.4.49")
binary = Resource("x86-print-this")

...

board.set_se_simpoint_workload(
    binary=binary,
    arguments=["hello", 1500]
)
```

Here we three resources are requested. "x86-npb" is an X86 disk image containing the NAS Parallel Benchmark suite built atop the Ubuntu operating system, "x86-linux-kernel-5.4.49" is the v5.4.49 Linux Kernel, and "x86-print-this" is a binary which accepts two arguments: a string to be printed, and the number of times to print it". The board is then set to run the "x86-print-this" binary with the arguments "hello" and "1500".

While powerful, obtaining resources in this manner has some limitations. First of all, running a simulation may require multiple resources to be maintained. Some resources will almost always require other resources to run. For example, our "x86-npb" disk image resource is useless without a kernel.

The other issue beyond obvious couplings of resources is resources may require particular parameters to be passed to be useful. For example, the "x86-npb" contains a suite of benchmark applications but specific command line parameters must be passed to specify what benchmark with what input is to be run. In efforts to simplify usage of gem5, we want users to simply specify what they want their simulated system to run. For example, "x86-npb-FS-input-A".

The solution to these problems are Workloads. Workloads allow for the bundling of resources and any input parameters. User’s need only specify the workload they wish to run and the gem5 Standard Library, interfacing, with the gem5-resources infrastructure, will setup the simulation to run correctly.

```python
from gem5.prebuilt.demo.x86_demo_board import X86DemoBoard
from gem5.resources.workload import Workload
from gem5.simulate.simulator import Simulator

board = X86DemoBoard()

board.set_workload(Workload("x86-ubuntu-18.04-boot"))

simulator = Simulator(board=board)
simulator.run()
```

"kernel" : "x86-linux-kernel-5.4.49", "disk_image":"x86-ubuntu-18.04-img"

Below we show using the "x86-ubuntu-18.04-boot" workload. This workload will use the "x86-linux-kernel-5.4.49" resource for the simulation kernel and the "x86-ubuntu-18.04-img" resource for the disk image. Upon boot completion the simulation will exit.

Another example would be the "x86-print-this-15000-with-simpoints" Workload. This specifies an SE workload running the "x86-print-this" binary resource, passing the parameters "print this" and "1500" with the "x86-print-this-1500-simpoints" simpoint resource.

At the time of writing the following Workloads are available to use:

- "x86-ubuntu-18.04-boot" : Runs an X86 Ubuntu 18.04 boot.
- "riscv-ubuntu-20.04-boot" : Runs an RISC-V Ubuntu 20.04 boot.
- "arm64-ubuntu-20.04-boot" : Runs an ARM-64 Ubuntu 20.04 boot.
- "x86-print-this-15000-with-simpoints" : Runs the "print-this" binary, print 15000 "print this" string to the terminal, with SimPoints.
- "x86-print-this-15000-with-simpoints-and-checkpoint" : Runs the "print-this" binary, print 15000 "print this" string to the terminal, with SimPoints and checkpoints.

More Workloads will be added overtime to provide the gem5 community with a rich variety of workloads they may plug into their simulations.